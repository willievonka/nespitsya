import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret from '../config.js'

class authController {
    async registration(req, res) {
        try {
            const { username, password, role } = req.body;
            if (!username || !password || !role) {
                return res.status(400).json({ message: 'Заполните все поля!' });
            }

            const allowedRoles = ['admin', 'organizer', 'user'];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ message: `Роль должна быть одной из: ${allowedRoles.join(', ')}` });
            }

            const candidate = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            if (candidate.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь уже существует' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = await db.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
                [username, hashPassword, role]
            );

            return res.json({ message: 'Регистрация прошла успешно', user: newUser.rows[0] });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Registration error' })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);

            if (!username || !password) {
                return res.status(400).json({ message: 'Заполните все поля!' });
            }

            if (user.rows.length === 0) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const validPassword = bcrypt.compareSync(password, user.rows[0].password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign(
                {
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    role: user.rows[0].role
                },
                secret.secretKey,
                { expiresIn: '24h' }
            );

            res.json({ token });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Login error' })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await db.query('SELECT id, username, role FROM users');
            res.json(users.rows);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

export default new authController()