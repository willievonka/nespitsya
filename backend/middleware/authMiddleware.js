import jwt from 'jsonwebtoken'
import secret from '../config.js'

export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Не авторизован' });

    try {
        const decoded = jwt.verify(token, secret.secretKey);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(403).json({ message: 'Неверный токен' });
    }
}