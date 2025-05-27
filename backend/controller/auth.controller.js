import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret from '../config.js';
import tokenService from '../tokenService.js';

class authController {
    async register(req, res) {
        try {
            const { email, password, role } = req.body;
            const candidate = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (candidate.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = await db.query(
                'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
                [email, hashPassword, role]
            );
            res.json(newUser.rows[0]);
        } catch (e) {
            res.status(500).json({ message: 'Ошибка при регистрации' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (user.rows.length === 0) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const isValidPassword = bcrypt.compareSync(password, user.rows[0].password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const payload = {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role
            };

            const tokens = tokenService.generateTokens(payload);
            await tokenService.saveToken(user.rows[0].id, tokens.refreshToken);

            let organizerInfo = null;
            if (payload.role === 'organizer') {
                const result = await db.query('SELECT * FROM organizers WHERE user_id = $1', [payload.id]);
                organizerInfo = result.rows[0];
            }

            res.json({ ...tokens, organizerInfo });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при входе' });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Токен не предоставлен' });
            }

            const userData = jwt.verify(refreshToken, secret.refreshKey);
            const tokenFromDb = await tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                return res.status(401).json({ message: 'Недействительный токен' });
            }

            const user = await db.query('SELECT * FROM users WHERE id = $1', [userData.id]);
            const payload = {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role
            };

            const tokens = tokenService.generateTokens(payload);
            await tokenService.saveToken(payload.id, tokens.refreshToken);

            res.json(tokens);
        } catch (e) {
            res.status(403).json({ message: 'Ошибка при обновлении токена' });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            await tokenService.removeToken(refreshToken);
            res.json({ message: 'Выход выполнен' });
        } catch (e) {
            res.status(500).json({ message: 'Ошибка при выходе' });
        }
    }


    async registrationOrganizer(req, res) {
        try {
            const { username, password, email, subsCount, eventsCount } = req.body;
            const image = req.file;

            if (!username || !password || !email || subsCount === undefined || eventsCount === undefined) {
                return res.status(400).json({ message: 'Заполните все обязательные поля!' });
            }

            const candidateUsername = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            const candidateEmail = await db.query('SELECT * FROM users WHERE email = $1', [email]);

            if (candidateUsername.rows.length > 0 || candidateEmail.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь с таким username или email уже существует' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const userResult = await db.query(
                'INSERT INTO users (username, password, role, email) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
                [username, hashPassword, 'organizer', email]
            );
            const newUser = userResult.rows[0];

            const imageName = image ? image.filename : '';

            await db.query(
                `INSERT INTO organizer_info (userId, name, image, subsCount, eventsCount)
             VALUES ($1, $2, $3, $4, $5)`,
                [newUser.id, username, imageName, subsCount, eventsCount]
            );

            const host = req.protocol + '://' + req.get('host');

            const response = {
                id: newUser.id,
                name: username,
                image: imageName ? `${host}/static/${imageName}` : '',
                role: newUser.role,
                subsCount,
                eventsCount
            };

            return res.json({ message: 'Регистрация организатора прошла успешно', organizer: response });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка регистрации организатора' });
        }
    }


    async getUserInfo(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Токен не предоставлен' });
            }

            const token = authHeader.split(' ')[1];
            let decoded;
            try {
                decoded = jwt.verify(token, secret.secretKey);
            } catch (err) {
                return res.status(401).json({ message: 'Недействительный или просроченный токен' });
            }

            const userId = decoded.id;

            const userResult = await db.query(
                'SELECT id, username, email, role, subscribes, favorites, image FROM users WHERE id = $1',
                [userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const user = userResult.rows[0];
            const host = req.protocol + '://' + req.get('host');
            const imageUrl = user.image ? `${host}/static/${user.image}` : '';

            let responseData = { ...user, image: imageUrl };

            if (user.role === 'organizer') {
                const organizerResult = await db.query(
                    'SELECT * FROM organizer_info WHERE userId = $1',
                    [user.id]
                );

                const orgData = organizerResult.rows[0];
                if (orgData) {
                    responseData.organizerInfo = {
                        ...orgData,
                        image: orgData.image ? `${host}/static/${orgData.image}` : ''
                    };
                }
            }

            return res.json(responseData);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении информации о пользователе' });
        }
    }


    async getUsers(req, res) {
        try {
            const usersResult = await db.query('SELECT id, username, email, role, subscribes, favorites, image FROM users');

            const host = req.protocol + '://' + req.get('host');

            const users = usersResult.rows.map(user => {
                const imageUrl = user.image ? `${host}/static/${user.image}` : '';
                const baseUser = { ...user, image: imageUrl };

                if (user.role === 'user') {
                    return baseUser;
                } else {
                    const { subscribes, favorites, ...rest } = baseUser;
                    return rest;
                }
            });

            res.json(users);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }


    async getUserById(req, res) {
        try {
            const { id } = req.params;

            const userResult = await db.query(
                'SELECT id, username, email, role, subscribes, favorites, image FROM users WHERE id = $1',
                [id]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const user = userResult.rows[0];
            const host = req.protocol + '://' + req.get('host');
            const imageUrl = user.image ? `${host}/static/${user.image}` : '';

            res.json({ ...user, image: imageUrl });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении пользователя' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { username, email, role, oldPassword, newPassword } = req.body;
            const image = req.file;

            const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const existingUser = userResult.rows[0];

            const allowedRoles = ['user', 'admin'];
            if (role && !allowedRoles.includes(role)) {
                return res.status(400).json({ message: 'Недопустимая роль' });
            }

            let updatedPassword = existingUser.password;
            if (newPassword) {
                if (!oldPassword) {
                    return res.status(400).json({ message: 'Укажите старый пароль для смены на новый' });
                }

                const isPasswordValid = bcrypt.compareSync(oldPassword, existingUser.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Текущий пароль неверный' });
                }

                // if (newPassword.length < 6) {
                //     return res.status(400).json({ message: 'Новый пароль должен быть не короче 6 символов' });
                // }

                updatedPassword = bcrypt.hashSync(newPassword, 7);
            }

            const updatedUsername = username || existingUser.username;
            const updatedEmail = email || existingUser.email;
            const updatedRole = role || existingUser.role;
            const updatedImage = image ? image.filename : existingUser.image;

            const updateResult = await db.query(
                'UPDATE users SET username = $1, email = $2, role = $3, password = $4, image = $5 WHERE id = $6 RETURNING *',
                [updatedUsername, updatedEmail, updatedRole, updatedPassword, updatedImage, id]
            );

            const host = req.protocol + '://' + req.get('host');
            const user = updateResult.rows[0];
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                message: 'Пользователь успешно обновлён',
                user: {
                    ...userWithoutPassword,
                    image: user.image ? `${host}/static/${user.image}` : ''
                }
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при обновлении пользователя' });
        }
    }


    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            await db.query('DELETE FROM users WHERE id = $1', [id]);

            res.json({ message: 'Пользователь успешно удалён' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при удалении пользователя' });
        }
    }

    async addSubscribe(req, res) {
        try {
            const { userId } = req.params;
            const { organizerId } = req.body;

            if (!userId || !organizerId) {
                return res.status(400).json({ message: 'userId и organizerId обязательны' });
            }

            const parsedUserId = parseInt(userId, 10);
            const parsedOrganizerId = parseInt(organizerId, 10);

            if (isNaN(parsedUserId) || isNaN(parsedOrganizerId)) {
                return res.status(400).json({ message: 'userId и organizerId должны быть числами' });
            }

            const userCheck = await db.query('SELECT 1 FROM users WHERE id = $1', [parsedUserId]);
            if (userCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const organizerCheck = await db.query(
                'SELECT 1 FROM users WHERE id = $1 AND role = $2',
                [parsedOrganizerId, 'organizer']
            );
            if (organizerCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Организатор не найден' });
            }

            await db.query(
                'UPDATE users SET subscribes = array_append(subscribes, $1) WHERE id = $2 AND NOT ($1 = ANY(subscribes))',
                [parsedOrganizerId, parsedUserId]
            );

            return res.json({ message: 'Организатор добавлен в подписки' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при добавлении подписки' });
        }
    }


    async removeSubscribe(req, res) {
        try {
            const { userId } = req.params;
            const { organizerId } = req.body;

            if (!userId || !organizerId) {
                return res.status(400).json({ message: 'userId и organizerId обязательны' });
            }

            const parsedUserId = parseInt(userId, 10);
            const parsedOrganizerId = parseInt(organizerId, 10);

            if (isNaN(parsedUserId) || isNaN(parsedOrganizerId)) {
                return res.status(400).json({ message: 'userId и organizerId должны быть числами' });
            }

            const userCheck = await db.query('SELECT 1 FROM users WHERE id = $1', [parsedUserId]);
            if (userCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const organizerCheck = await db.query(
                'SELECT 1 FROM users WHERE id = $1 AND role = $2',
                [parsedOrganizerId, 'organizer']
            );
            if (organizerCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Организатор не найден' });
            }

            await db.query(
                'UPDATE users SET subscribes = array_remove(subscribes, $1) WHERE id = $2',
                [parsedOrganizerId, parsedUserId]
            );

            return res.json({ message: 'Организатор удалён из подписок' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при удалении подписки' });
        }
    }

    async clearSubscribes(req, res) {
        try {
            const { userId } = req.params;

            const parsedUserId = parseInt(userId, 10);
            if (isNaN(parsedUserId)) {
                return res.status(400).json({ message: 'userId должен быть числом' });
            }

            const userCheck = await db.query('SELECT 1 FROM users WHERE id = $1', [parsedUserId]);
            if (userCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            await db.query('UPDATE users SET subscribes = ARRAY[]::integer[] WHERE id = $1', [parsedUserId]);

            res.json({ message: 'Подписки очищены' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при очистке подписок' });
        }
    }



    async addFavorite(req, res) {
        try {
            const { userId } = req.params;
            const { eventId } = req.body;

            // Проверка: ID пользователя и ID события существуют и корректны
            if (!userId || isNaN(parseInt(userId))) {
                return res.status(400).json({ message: 'Некорректный userId' });
            }

            if (!eventId || typeof eventId !== 'string') {
                return res.status(400).json({ message: 'eventId обязателен и должен быть строкой' });
            }

            // Проверка: пользователь существует
            const userCheck = await db.query('SELECT 1 FROM users WHERE id = $1', [userId]);
            if (userCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Проверка: событие существует
            const eventCheck = await db.query('SELECT 1 FROM event WHERE id = $1', [eventId]);
            if (eventCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Событие не найдено' });
            }

            // Добавление в избранное только если такого ещё нет
            const update = await db.query(
                'UPDATE users SET favorites = array_append(favorites, $1) WHERE id = $2 AND NOT ($1 = ANY(favorites))',
                [eventId, userId]
            );

            if (update.rowCount === 0) {
                return res.status(409).json({ message: 'Ивент уже в избранном или пользователь не найден' });
            }

            return res.json({ message: 'Ивент добавлен в избранное' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при добавлении в избранное' });
        }
    }

    async removeFavorite(req, res) {
        try {
            const { userId } = req.params;
            const { eventId } = req.body;

            if (!userId || isNaN(parseInt(userId))) {
                return res.status(400).json({ message: 'Некорректный userId' });
            }

            if (!eventId || typeof eventId !== 'string') {
                return res.status(400).json({ message: 'eventId обязателен и должен быть строкой' });
            }

            // Проверка: пользователь существует
            const userCheck = await db.query('SELECT 1 FROM users WHERE id = $1', [userId]);
            if (userCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Удаление из избранного
            const update = await db.query(
                'UPDATE users SET favorites = array_remove(favorites, $1) WHERE id = $2',
                [eventId, userId]
            );

            if (update.rowCount === 0) {
                return res.status(409).json({ message: 'Ивент не найден в избранном или пользователь не найден' });
            }

            return res.json({ message: 'Ивент удалён из избранного' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при удалении из избранного' });
        }
    }

    async clearFavorites(req, res) {
        try {
            const { userId } = req.params;

            const parsedUserId = parseInt(userId, 10);
            if (isNaN(parsedUserId)) {
                return res.status(400).json({ message: 'userId должен быть числом' });
            }
            const userCheck = await db.query('SELECT 1 FROM users WHERE id = $1', [parsedUserId]);
            if (userCheck.rowCount === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            await db.query('UPDATE users SET favorites = ARRAY[]::integer[] WHERE id = $1', [parsedUserId]);

            res.json({ message: 'Избранное очищено' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при очистке избранного' });
        }
    }

}

export default new authController();