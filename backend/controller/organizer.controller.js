import db from '../db.js'

class OrganizerController {
    async getOrganizers(req, res) {
        try {
            const organizers = await db.query(`
            SELECT u.id, u.username, u.email, u.role, oi.name, oi.image,
                (SELECT COUNT(*) FROM event_organizer eo WHERE eo.id_organizer = u.id) AS "eventsCount",
                (SELECT COUNT(*) FROM organizer_subscriptions os WHERE os.organizer_id = u.id) AS "subsCount"
            FROM users u
            LEFT JOIN organizer_info oi ON u.id = oi.userId
            WHERE u.role = $1
        `, ['organizer']);

            if (organizers.rows.length === 0) {
                return res.status(404).json({ message: "Организаторов нет" });
            }

            const result = organizers.rows.map(organizer => ({
                id: organizer.id,
                username: organizer.username,
                email: organizer.email,
                role: organizer.role,
                name: organizer.name || '',
                image: organizer.image ? `${req.protocol}://${req.get('host')}/static/${organizer.image}` : '',
                subsCount: organizer.subsCount || 0,
                eventsCount: organizer.eventsCount || 0
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

            const organizer = await db.query(`
            SELECT u.id, u.username, u.email, u.role, oi.name, oi.image,
                (SELECT COUNT(*) FROM organizer_subscriptions os WHERE os.organizer_id = u.id) AS "subsCount",
                (SELECT COUNT(*) FROM event_organizer eo WHERE eo.id_organizer = u.id) AS "eventsCount"
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
                name: result.name || '',
                image: result.image ? `${req.protocol}://${req.get('host')}/static/${result.image}` : '',
                subsCount: result.subsCount || 0,
                eventsCount: result.eventsCount || 0
            };

            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOrganizersByIds(req, res) {
        try {
            const { organizerIds } = req.body;

            if (!Array.isArray(organizerIds) || organizerIds.length === 0) {
                return res.status(400).json({ message: 'organizerIds должен быть непустым массивом' });
            }

            const organizersResult = await db.query(
                `SELECT u.id, u.username, u.email, u.role, oi.name, oi.image AS "organizerImage",                     
                (SELECT COUNT(*) FROM organizer_subscriptions os WHERE os.organizer_id = u.id) AS "subsCount",
                (SELECT COUNT(*) FROM event_organizer eo WHERE eo.id_organizer = u.id) AS "eventsCount"
             FROM users u
             LEFT JOIN organizer_info oi ON u.id = oi.userId
             WHERE u.id = ANY($1) AND u.role = 'organizer'
             ORDER BY u.username ASC`,
                [organizerIds]
            );

            const host = req.protocol + '://' + req.get('host');
            const formatted = organizersResult.rows.map(org => ({
                id: org.id,
                username: org.username,
                email: org.email,
                role: org.role,
                name: org.name || '',
                image: org.organizerImage ? `${host}/static/${org.organizerImage}` : '',
                subsCount: org.subsCount || 0,
                eventsCount: org.eventsCount || 0
            }));

            res.json(formatted);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении организаторов' });
        }
    }



}

export default new OrganizerController();
