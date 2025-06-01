import jwt from 'jsonwebtoken';
import secret from './config.js';
import db from './db.js';

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, secret.secretKey, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, secret.refreshKey, { expiresIn: '30d' });

    return { accessToken, refreshToken };
};

const saveToken = async (userId, refreshToken) => {
    const existing = await db.query('SELECT * FROM tokens WHERE user_id = $1', [userId]);

    if (existing.rows.length > 0) {
        await db.query('UPDATE tokens SET refresh_token = $1 WHERE user_id = $2', [refreshToken, userId]);
    } else {
        await db.query('INSERT INTO tokens (user_id, refresh_token) VALUES ($1, $2)', [userId, refreshToken]);
    }
};

const removeToken = async (refreshToken) => {
    await db.query('DELETE FROM tokens WHERE refresh_token = $1', [refreshToken]);
};

const findToken = async (refreshToken) => {
    const token = await db.query('SELECT * FROM tokens WHERE refresh_token = $1', [refreshToken]);
    return token.rows[0];
};

export default {
    generateTokens,
    saveToken,
    removeToken,
    findToken
};
