import db from '../db.js';

class PlaceController {
    async createPlace(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Название места обязательно!" });
            }

            const newPlace = await db.query(
                "INSERT INTO place (name) VALUES ($1) RETURNING *", 
                [name]
            );
            res.json(newPlace.rows[0]);
        } catch (error) {
            console.error("Ошибка при создании места:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getPlaces(req, res) {
        try {
            const places = await db.query("SELECT * FROM place");
            res.json(places.rows);
        } catch (error) {
            console.error("Ошибка при получении места:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOnePlace(req, res) {
        try {
            const { id } = req.params;
            const place = await db.query("SELECT * FROM place WHERE id = $1", [id]);
            
            if (place.rows.length === 0) {
                return res.status(404).json({ message: "Место не найдено" });
            }

            res.json(place.rows[0]);
        } catch (error) {
            console.error("Ошибка при получении места:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async updatePlace(req, res) {
        try {
            const { id, name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Название места обязательно для обновления!" });
            }

            const place = await db.query(
                "UPDATE place SET name = $1 WHERE id = $2 RETURNING *", 
                [name, id]
            );

            if (place.rows.length === 0) {
                return res.status(404).json({ message: "Место не найдено" });
            }

            res.json(place.rows[0]);
        } catch (error) {
            console.error("Ошибка при обновлении места:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async deletePlace(req, res) {
        try {
            const { id } = req.params;
            const place = await db.query("DELETE FROM place WHERE id = $1 RETURNING *", [id]);

            if (place.rows.length === 0) {
                return res.status(404).json({ message: "Место не найдено" });
            }

            res.json({ message: "Удаление выполнено", deletedPlace: place.rows[0] });
        } catch (error) {
            console.error("Ошибка при удалении места:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new PlaceController();
