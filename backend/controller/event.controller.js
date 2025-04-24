import db from '../db.js'
import { fileURLToPath } from 'url';
import { dirname} from 'path';
import path from 'path';
import fs from 'fs/promises'; // обязательно использовать промис-версию fs для await

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EventController {
    async createEvent(req, res) {
        try {
            const { descr, name, id_place, id_city, datetime, price, artists, tags } = req.body;
            // const organizer = req.user.id
            const organizer = 1 // ВРЕМЕННО!!!
            const image = req.file?.filename;

            if (!descr || !name || !id_place || !id_city || !datetime || !price || !image) {
                return res.status(400).json({ message: "Все поля, кроме артистов и тэгов обязательны!" });
            }

            // Проверка существования города
            const cityCheck = await db.query('SELECT 1 FROM city WHERE id = $1', [id_city]);
            if (cityCheck.rowCount === 0) {
                return res.status(400).json({ message: "Указанный город не существует" });
            }

            // Проверка существования места
            const placeCheck = await db.query('SELECT 1 FROM place WHERE id = $1', [id_place]);
            if (placeCheck.rowCount === 0) {
                return res.status(400).json({ message: "Указанное место не существует" });
            }

            const checkExistence = async (items, table, column, label) => {
                const array = Array.isArray(items) ? items : [items];
                const check = await db.query(`SELECT ${column} FROM ${table} WHERE ${column} = ANY($1::int[])`, [array]);
                if (check.rowCount !== array.length) {
                    throw new Error(`Один или несколько ${label} не существуют`);
                }
                return array;
            };
    
            let artistArray = [];
            let tagArray = [];
    
            try {
                if (artists) {
                    artistArray = await checkExistence(artists, 'artist', 'id', 'артистов');
                }
                if (tags) {
                    tagArray = await checkExistence(tags, 'tag', 'id', 'тэгов');
                }
            } catch (err) {
                return res.status(400).json({ message: err.message });
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

            const host = req.protocol + '://' + req.get('host');
            const enrichedEvents = events.rows.map(event => {
                return {
                    ...event,
                    image: `${host}/static/${event.image}`,
                };
            });

            res.json(enrichedEvents);
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

            const host = req.protocol + '://' + req.get('host');
            const enrichedEvents = events.rows.map(event => {
                return {
                    ...event,
                    image: `${host}/static/${event.image}`
                };
            });

            res.json(enrichedEvents);
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

            const host = req.protocol + '://' + req.get('host');
            const enrichedEvents = events.rows.map(event => {
                return {
                    ...event,
                    image: `${host}/static/${event.image}`
                };
            });

            res.json(enrichedEvents);
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

            const host = req.protocol + '://' + req.get('host');
            const enrichedEvents = events.rows.map(event => {
                return {
                    ...event,
                    image: `${host}/static/${event.image}`
                };
            });

            res.json(enrichedEvents);
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

            const host = req.protocol + '://' + req.get('host');
            const enrichedEvents = events.rows.map(event => {
                return {
                    ...event,
                    image: `${host}/static/${event.image}`
                };
            });

            res.json(enrichedEvents);
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            res.status(500).json({ message: "Ошибка" });
        }
    }

    async getOneEvent(req, res) {
        try {
            const id = req.params.id;
            const events = await db.query("SELECT * FROM event WHERE id = $1", [id]);
            if (events.rows.length === 0) {
                return res.status(404).json({ message: "Событие не найдено" });
            }

            const host = req.protocol + '://' + req.get('host');
            const enrichedEvents = events.rows.map(event => {
                return {
                    ...event,
                    image: `${host}/static/${event.image}`
                };
            });
            res.json(enrichedEvents);
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
    
            // Удаляем и получаем удалённую запись
            const result = await db.query("DELETE FROM event WHERE id = $1 RETURNING *", [id]);
    
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Событие не найдено" });
            }
    
            const imageFilename = result.rows[0].image;
    
            if (imageFilename) {
                const imagePath = path.join(__dirname, '..', 'static', imageFilename);
                try {
                    await fs.unlink(imagePath);
                    console.log(`Изображение ${imageFilename} удалено`);
                } catch (err) {
                    console.warn(`Не удалось удалить изображение: ${err.message}`);
                }
            }
    
            res.json({ message: "Событие удалено" });
    
        } catch (error) {
            console.error("Ошибка при удалении события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new EventController();
