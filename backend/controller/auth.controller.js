import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret from '../config.js'

class authController {
    async registrationUser(req, res) {
        try {
            const { username, password, email, role } = req.body;

            if (!username || !password || !email || !role) {
                return res.status(400).json({ message: 'Заполните все обязательные поля!' });
            }

            const allowedRoles = ['user', 'admin'];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ message: 'Роль должна быть одной из: user, admin' });
            }

            const candidateUsername = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            const candidateEmail = await db.query('SELECT * FROM users WHERE email = $1', [email]);

            if (candidateUsername.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
            }

            if (candidateEmail.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь с такой электронной почтой уже существует' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const newUser = await db.query(
                'INSERT INTO users (username, password, role, email, subscribes, favorites) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [username, hashPassword, role, email, [], []]
            );


            return res.json({ message: 'Регистрация прошла успешно', user: newUser.rows[0] });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка регистрации' });
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

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Заполните все поля!' });
            }

            const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

            if (userResult.rows.length === 0) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const user = userResult.rows[0];

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                secret.secretKey,
                { expiresIn: '24h' }
            );

            // Если организатор, подгружаем доп. информацию
            let organizerInfo = null;
            if (user.role === 'organizer') {
                const organizerResult = await db.query('SELECT * FROM organizer_info WHERE userId = $1', [user.id]);
                organizerInfo = organizerResult.rows[0] || null;
            }

            res.json({ token, organizerInfo });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Ошибка входа' });
        }
    }

    async getUsers(req, res) {
        try {
            const usersResult = await db.query('SELECT id, username, email, role, subscribes, favorites FROM users');

            const users = usersResult.rows.map(user => {
                if (user.role === 'user') {
                    return user; // показываем подписки и избранное
                } else {
                    // скрываем эти поля
                    const { subscribes, favorites, ...rest } = user;
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
                'SELECT id, username, email, role, subscribes, favorites FROM users WHERE id = $1',
                [id]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const user = userResult.rows[0];

            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении пользователя' });
        }
    }


    async addSubscribe(req, res) {
        try {
            const { userId, organizerId } = req.body;

            if (!userId || !organizerId) {
                return res.status(400).json({ message: 'userId и organizerId обязательны' });
            }

            await db.query(
                'UPDATE users SET subscribes = array_append(subscribes, $1) WHERE id = $2 AND NOT ($1 = ANY(subscribes))',
                [organizerId, userId]
            );

            return res.json({ message: 'Организатор добавлен в подписки' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при добавлении подписки' });
        }
    }

    async removeSubscribe(req, res) {
        try {
            const { userId, organizerId } = req.body;

            if (!userId || !organizerId) {
                return res.status(400).json({ message: 'userId и organizerId обязательны' });
            }

            await db.query(
                'UPDATE users SET subscribes = array_remove(subscribes, $1) WHERE id = $2',
                [organizerId, userId]
            );

            return res.json({ message: 'Организатор удалён из подписок' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при удалении подписки' });
        }
    }

    async addFavorite(req, res) {
        try {
            const { userId, eventId } = req.body;

            if (!userId || !eventId) {
                return res.status(400).json({ message: 'userId и eventId обязательны' });
            }

            await db.query(
                'UPDATE users SET favorites = array_append(favorites, $1) WHERE id = $2 AND NOT ($1 = ANY(favorites))',
                [eventId, userId]
            );

            return res.json({ message: 'Ивент добавлен в избранное' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при добавлении в избранное' });
        }
    }

    async removeFavorite(req, res) {
        try {
            const { userId, eventId } = req.body;

            if (!userId || !eventId) {
                return res.status(400).json({ message: 'userId и eventId обязательны' });
            }

            await db.query(
                'UPDATE users SET favorites = array_remove(favorites, $1) WHERE id = $2',
                [eventId, userId]
            );

            return res.json({ message: 'Ивент удалён из избранного' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при удалении из избранного' });
        }
    }


}

export default new authController();