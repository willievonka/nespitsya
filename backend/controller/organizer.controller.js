import db from '../db.js'

class OrganizerController{
    async getOrganizers(req, res) {
        try {
            const organizers = await db.query('SELECT id, username, role FROM users WHERE role = $1', ['organizer'])
            if (organizers.rows.length === 0) {
                return res.status(404).json({ message: "Организаторов нет" });
            }

            res.json(organizers.rows)
            
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new OrganizerController()