import db from '../db.js';

class ArtistController {
    async createArtist(req, res) {
        try {
            const { name, followers } = req.body;

            if (!name || !followers) {
                return res.status(400).json({ message: "Поля 'name' и 'followers' обязательны" });
            }

            const newArtist = await db.query(
                "INSERT INTO artist (name, followers) VALUES ($1, $2) RETURNING *", 
                [name, followers]
            );

            res.json(newArtist.rows[0]);
        } catch (error) {
            console.error("Ошибка при создании артиста:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getArtists(req, res) {
        try {
            const artists = await db.query("SELECT * FROM artist");
            res.json(artists.rows);
        } catch (error) {
            console.error("Ошибка при получении артиста:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOneArtist(req, res) {
        try {
            const { id } = req.params;
            const artist = await db.query("SELECT * FROM artist WHERE id = $1", [id]);
            
            if (artist.rows.length === 0) {
                return res.status(404).json({ message: "артист не найден" });
            }

            res.json(artist.rows[0]);
        } catch (error) {
            console.error("Ошибка при получении артиста:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async updateArtist(req, res) {
        try {
            const { id, name, followers } = req.body;

            if (!id || !name || !followers) {
                return res.status(400).json({ message: "Поля 'id', 'name' и 'followers' обязательны" });
            }

            const artist = await db.query(
                "UPDATE artist SET name = $1, followers = $2 WHERE id = $3 RETURNING *", 
                [name, followers, id]
            );

            if (artist.rows.length === 0) {
                return res.status(404).json({ message: "артист не найден" });
            }

            res.json(artist.rows[0]);
        } catch (error) {
            console.error("Ошибка при обновлении артиста:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async deleteArtist(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Поле 'id' обязательно" });
            }

            const artist = await db.query("DELETE FROM artist WHERE id = $1 RETURNING *", [id]);

            if (artist.rows.length === 0) {
                return res.status(404).json({ message: "артист не найден" });
            }

            res.json({ message: "Удаление выполнено", deletedArtist: artist.rows[0] });
        } catch (error) {
            console.error("Ошибка при удалении артиста:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new ArtistController();
