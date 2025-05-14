import db from '../db.js';

class TagController {
    async createTag(req, res) {
        try {
            const { name } = req.body;
            const newTag = await db.query(
                "INSERT INTO tag (name) VALUES ($1) RETURNING *", 
                [name]
            );
            res.json(newTag.rows[0]);
        } catch (error) {
            console.error("Ошибка при создании тэга:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getTags(req, res) {
        try {
            const tags = await db.query("SELECT * FROM tag");
            res.json(tags.rows);
        } catch (error) {
            console.error("Ошибка при получении тэгов:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOneTag(req, res) {
        try {
            const { id } = req.params;
            const tag = await db.query("SELECT * FROM tag WHERE id = $1", [id]);
            
            if (tag.rows.length === 0) {
                return res.status(404).json({ message: "тэг не найден" });
            }

            res.json(tag.rows[0]);
        } catch (error) {
            console.error("Ошибка при получении тэга:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async updateTag(req, res) {
        try {
            const { id, name } = req.body;
            const tag = await db.query(
                "UPDATE tag SET name = $1 WHERE id = $2 RETURNING *", 
                [name, id]
            );

            if (tag.rows.length === 0) {
                return res.status(404).json({ message: "тэг не найден" });
            }

            res.json(tag.rows[0]);
        } catch (error) {
            console.error("Ошибка при обновлении тэга:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async deleteTag(req, res) {
        try {
            const { id } = req.params;
            const tag = await db.query("DELETE FROM tag WHERE id = $1 RETURNING *", [id]);

            if (tag.rows.length === 0) {
                return res.status(404).json({ message: "тэг не найден" });
            }

            res.json({ message: "Удаление выполнено", deletedTag: tag.rows[0] });
        } catch (error) {
            console.error("Ошибка при удалении тэга:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new TagController();
