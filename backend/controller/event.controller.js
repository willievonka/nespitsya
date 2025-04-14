import db from '../db.js'

class EventController {
    async createEvent(req, res) {
        try {
            const { descr, name, id_place, id_city, datetime, price, image, artists, tags } = req.body;
            const organizer = req.user.id

            if (!descr || !name || !id_place || !id_city || !datetime || !price || !image) {
                return res.status(400).json({ message: "Все поля, кроме артистов и тэгов обязательны!" });
            }

            const eventResult = await db.query(
                `INSERT INTO event (descr, name, id_place, id_city, datetime, price, image)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [descr, name, id_place, id_city, datetime, price, image]
            );

            const id_event = eventResult.rows[0].id;

            if (artists) {
                const artistArray = Array.isArray(artists) ? artists : [artists];
                if (artistArray.length > 0) {
                    const artistValues = artistArray.map(artist => `(${id_event}, ${artist})`).join(',');
                    await db.query(`INSERT INTO event_artist (id_event, id_artist) VALUES ${artistValues}`);
                }
            }

            if (tags) {
                const tagArray = Array.isArray(tags) ? tags : [tags];
                if (tagArray.length > 0) {
                    const tagValues = tagArray.map(tag => `(${id_event}, ${tag})`).join(',');
                    await db.query(`INSERT INTO event_tag (id_event, id_tag) VALUES ${tagValues}`);
                }
            }

            if (organizer) {
                const organizerArray = Array.isArray(organizer) ? organizer : [organizer];
                if (organizerArray.length > 0) {
                    const organizerValues = organizerArray.map(org => `(${id_event}, ${org})`).join(',');
                    await db.query(`INSERT INTO event_organizer (id_event, id_organizer) VALUES ${organizerValues}`);
                }
            }

            res.json({ message: "Мероприятие создано!", id_event });
        } catch (error) {
            console.error("Ошибка при создании события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEvents(req, res) {
        try {
            const events = await db.query("SELECT * FROM event");
            res.json(events.rows);
        } catch (error) {
            console.error("Ошибка при получении событий:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsFromCity(req, res) {
        try {
            const id = req.params.id;
            const events = await db.query(`SELECT * FROM event WHERE id_city = ${id};`);
            if (events.rows.length === 0) {
                return res.status(404).json({ message: "В этом городе нет событий" });
            }
            res.json(events.rows);
        } catch (error) {
            console.error("Ошибка при получении событий:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsByArtist(req, res) {
        try {
            const id = req.params.id;
            const events = await db.query(`SELECT e.* FROM event e
                                            JOIN event_artist ea ON e.id = ea.id_event
                                            WHERE ea.id_artist = ${id};`);
            if (events.rows.length === 0) {
                return res.status(404).json({ message: "У этого артиста нет событий" });
            }
            res.json(events.rows);
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            res.status(500).json({ message: "Ошибка" });
        }
    }

    async getEventsByOrganizer(req, res) {
        try {
            const id = req.params.id;
            const events = await db.query(`SELECT e.* FROM event e
                                            JOIN event_organizer ea ON e.id = ea.id_event
                                            WHERE ea.id_organizer = ${id};`);
            if (events.rows.length === 0) {
                return res.status(404).json({ message: "У этого организатора нет событий" });
            }
            res.json(events.rows);
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            res.status(500).json({ message: "Ошибка" });
        }
    }

    async getEventsByTag(req, res) {
        try {
            const id = req.params.id;
            const events = await db.query(`SELECT e.* FROM event e
                                            JOIN event_tag ea ON e.id = ea.id_event
                                            WHERE ea.id_tag = ${id};`);
            if (events.rows.length === 0) {
                return res.status(404).json({ message: "Событий с этим тегом нет" });
            }
            res.json(events.rows);
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            res.status(500).json({ message: "Ошибка" });
        }
    }

    async getOneEvent(req, res) {
        try {
            const id = req.params.id;
            const event = await db.query("SELECT * FROM event WHERE id = $1", [id]);
            if (event.rows.length === 0) {
                return res.status(404).json({ message: "Событие не найдено" });
            }
            res.json(event.rows[0]);
        } catch (error) {
            console.error("Ошибка при получении события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async updateEvent(req, res) {
        try {
            const { id, name, descr, id_city } = req.body;

            if (!name || !descr || !id_city) {
                return res.status(400).json({ message: "Название, описание и город обязательны для обновления события" });
            }

            const event = await db.query(
                "UPDATE event SET name = $1, descr = $2, id_city = $3 WHERE id = $4 RETURNING *", 
                [name, descr, id_city, id]
            );
            if (event.rows.length === 0) {
                return res.status(404).json({ message: "Событие не найдено" });
            }
            res.json(event.rows[0]);
        } catch (error) {
            console.error("Ошибка при обновлении события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async deleteEvent(req, res) {
        try {
            const id = req.params.id;
            const result = await db.query("DELETE FROM event WHERE id = $1 RETURNING *", [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Событие не найдено" });
            }
            res.json({ message: "Событие удалено" });
        } catch (error) {
            console.error("Ошибка при удалении события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new EventController();
