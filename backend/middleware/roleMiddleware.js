import jwt from 'jsonwebtoken';
import secret from '../config.js';

export function roleMiddleware(requiredRoles) {
    return function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Не авторизован: нет токена' });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Не авторизован: пустой токен' });
            }

            const decoded = jwt.verify(token, secret.secretKey);
            req.user = decoded;

            const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Нет доступа: недостаточно прав' });
            }

            next();
        } catch (e) {
            console.error('Ошибка при проверке токена:', e.message);
            return res.status(403).json({ message: 'Неверный токен' });
        }
    };
}
