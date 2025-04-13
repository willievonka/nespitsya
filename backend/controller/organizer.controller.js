import db from '../db.js';

class OrganizerController {
    async createOrganizer(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Имя организатора обязательно!" });
            }

            const newOrganizer = await db.query(
                "INSERT INTO organizer (name) VALUES ($1) RETURNING *", 
                [name]
            );
            res.json(newOrganizer.rows[0]);
        } catch (error) {
            console.error("Ошибка при создании организатора:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOrganizers(req, res) {
        try {
            const organizers = await db.query("SELECT * FROM organizer");
            res.json(organizers.rows);
        } catch (error) {
            console.error("Ошибка при получении организаторов:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOneOrganizer(req, res) {
        try {
            const { id } = req.params;
            const organizer = await db.query("SELECT * FROM organizer WHERE id = $1", [id]);
            
            if (organizer.rows.length === 0) {
                return res.status(404).json({ message: "Организатор не найден" });
            }

            res.json(organizer.rows[0]);
        } catch (error) {
            console.error("Ошибка при получении организатора:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async updateOrganizer(req, res) {
        try {
            const { id, name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Имя организатора обязательно для обновления!" });
            }

            const organizer = await db.query(
                "UPDATE organizer SET name = $1 WHERE id = $2 RETURNING *", 
                [name, id]
            );

            if (organizer.rows.length === 0) {
                return res.status(404).json({ message: "Организатор не найден" });
            }

            res.json(organizer.rows[0]);
        } catch (error) {
            console.error("Ошибка при обновлении организатора:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async deleteOrganizer(req, res) {
        try {
            const { id } = req.params;
            const organizer = await db.query("DELETE FROM organizer WHERE id = $1 RETURNING *", [id]);

            if (organizer.rows.length === 0) {
                return res.status(404).json({ message: "Организатор не найден" });
            }

            res.json({ message: "Удаление выполнено", deletedOrganizer: organizer.rows[0] });
        } catch (error) {
            console.error("Ошибка при удалении организатора:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new OrganizerController();
