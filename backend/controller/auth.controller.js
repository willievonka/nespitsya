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

            if (candidateUsername.rows.length > 0 || candidateEmail.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь с таким username или email уже существует' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const newUser = await db.query(
                'INSERT INTO users (username, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, hashPassword, role, email]
            );

            return res.json({ message: 'Регистрация прошла успешно', user: newUser.rows[0] });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка регистрации' });
        }
    }

    async registrationOrganizer(req, res) {
        try {
            const { username, password, email } = req.body;
            const imageFile = req.file;
    
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Заполните все обязательные поля!' });
            }
    
            const candidateUsername = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            const candidateEmail = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
            if (candidateUsername.rows.length > 0 || candidateEmail.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь с таким username или email уже существует' });
            }
    
            const hashPassword = bcrypt.hashSync(password, 7);
    
            const userResult = await db.query(
                'INSERT INTO users (username, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, hashPassword, 'organizer', email]
            );
            const newUser = userResult.rows[0];
    
            const imageFileName = imageFile ? imageFile.filename : '';
    
            const organizerInfoResult = await db.query(
                `INSERT INTO organizer_info (userId, name, image) 
                 VALUES ($1, $2, $3) RETURNING *`,
                [newUser.id, username, imageFileName]
            );
    
            const organizer = organizerInfoResult.rows[0];
    
            const host = req.protocol + '://' + req.get('host');
    
            const response = {
                id: newUser.id,
                name: organizer.name,
                image: organizer.image ? `${host}/static/${organizer.image}` : '',
                role: newUser.role,
                subsCount: organizer.subsCount,
                eventsCount: organizer.eventsCount
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
            const users = await db.query('SELECT id, username, email, role FROM users');
            res.json(users.rows);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

export default new authController();