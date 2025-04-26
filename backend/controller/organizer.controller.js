import db from '../db.js'

class OrganizerController {
    async getOrganizers(req, res) {
        try {
            // Запрашиваем организаторов с дополнительной информацией из обеих таблиц: users и organizer_info
            const organizers = await db.query(`
                SELECT u.id, u.username, u.email, u.role, oi.name, oi.image, oi.subsCount,
                    (SELECT COUNT(*) FROM event_organizer eo WHERE eo.id_organizer = u.id) AS eventsCount
                FROM users u
                LEFT JOIN organizer_info oi ON u.id = oi.userId
                WHERE u.role = $1
            `, ['organizer']);
    
            if (organizers.rows.length === 0) {
                return res.status(404).json({ message: "Организаторов нет" });
            }
    
            // Формируем результат
            const result = organizers.rows.map(organizer => ({
                id: organizer.id,
                username: organizer.username,
                email: organizer.email,
                role: organizer.role,
                name: organizer.name || '',  // Если имя отсутствует, выводим пустую строку
                image: organizer.image ? `${req.protocol}://${req.get('host')}/static/${organizer.image}` : '',
                subsCount: organizer.subsCount || 0, // Если не задано, выводим 0
                eventsCount: parseInt(organizer.eventscount, 10) || 0 // Считаем правильно количество мероприятий
            }));
    
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOrganizerById(req, res) {
        try {
            const { id } = req.params;
    
            // Запрашиваем информацию о конкретном организаторе с подсчетом количества событий
            const organizer = await db.query(`
                SELECT u.id, u.username, u.email, u.role, oi.name, oi.image, oi.subsCount,
                    (SELECT COUNT(*) FROM event_organizer eo WHERE eo.id_organizer = u.id) AS eventsCount
                FROM users u
                LEFT JOIN organizer_info oi ON u.id = oi.userId
                WHERE u.id = $1
            `, [id]);
    
            if (organizer.rows.length === 0) {
                return res.status(404).json({ message: "Организатор не найден" });
            }
    
            const result = organizer.rows[0];
            const response = {
                id: result.id,
                username: result.username,
                email: result.email,
                role: result.role,
                name: result.name || '', // Если имя отсутствует, выводим пустую строку
                image: result.image ? `${req.protocol}://${req.get('host')}/static/${result.image}` : '',
                subsCount: result.subsCount || 0, // Если не задано, выводим 0
                eventsCount: parseInt(result.eventscount, 10) || 0 // Правильный eventsCount
            };
    
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new OrganizerController();
