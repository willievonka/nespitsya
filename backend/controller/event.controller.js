import db from '../db.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EventController {
    async createEvent(req, res) {
        try {
            const { description, title, placeId, cityId, dateStart, dateEnd, price, artists, tags } = req.body;
            const organizer = req.user.id
            const image = req.file?.filename;

            if (!description || !title || !placeId || !cityId || !dateStart || !dateEnd || !price || !image) {
                return res.status(400).json({ message: "Все поля, кроме артистов и тэгов обязательны!" });
            }

            const parsedDateStart = new Date(dateStart);
            const parsedDateEnd = new Date(dateEnd);

            if (isNaN(parsedDateStart.getTime()) || isNaN(parsedDateEnd.getTime())) {
                return res.status(400).json({ message: "Некорректный формат даты!" });
            }

            const isoDateStart = parsedDateStart.toISOString();
            const isoDateEnd = parsedDateEnd.toISOString();

            // Проверка существования города
            const cityCheck = await db.query('SELECT 1 FROM city WHERE id = $1', [cityId]);
            if (cityCheck.rowCount === 0) {
                return res.status(400).json({ message: "Указанный город не существует" });
            }

            // Проверка существования места
            const placeCheck = await db.query('SELECT 1 FROM place WHERE id = $1', [placeId]);
            if (placeCheck.rowCount === 0) {
                return res.status(400).json({ message: "Указанное место не существует" });
            }

            // Проверка существования артистов и тэгов
            const checkExistence = async (items, table, column, label) => {
                const array = Array.isArray(items) ? items : [items];
                if (!array.length) return array;
                const check = await db.query(`SELECT ${column} FROM ${table} WHERE ${column} = ANY($1::int[])`, [array]);
                if (check.rowCount !== array.length) {
                    throw new Error(`Один или несколько ${label} не существуют`);
                }
                return array;
            };

            let artistArray = [];
            let tagArray = [];
            try {
                if (artists) artistArray = await checkExistence(artists, 'artist', 'id', 'артистов');
                if (tags) tagArray = await checkExistence(tags, 'tag', 'id', 'тэгов');
            } catch (err) {
                return res.status(400).json({ message: err.message });
            }

            // Создание события
            const eventResult = await db.query(
                `INSERT INTO event (description, title, "placeId", "cityId", "dateStart", "dateEnd", price, image)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [description, title, placeId, cityId, isoDateStart, isoDateEnd, price, image]
            );
            const id_event = eventResult.rows[0].id;

            // Связывание с артистами
            if (artistArray.length) {
                const vals = artistArray.map(a => `(${id_event}, ${a})`).join(',');
                await db.query(`INSERT INTO event_artist (id_event, id_artist) VALUES ${vals}`);
            }

            // Связывание с тэгами
            if (tagArray.length) {
                const vals = tagArray.map(t => `(${id_event}, ${t})`).join(',');
                await db.query(`INSERT INTO event_tag (id_event, id_tag) VALUES ${vals}`);
            }

            // Связывание с организатором
            if (organizer) {
                await db.query(
                    `INSERT INTO event_organizer (id_event, id_organizer) VALUES ($1, $2)`,
                    [id_event, organizer]
                );
                await db.query(
                    `UPDATE organizer_info SET eventsCount = eventsCount + 1 WHERE userId = $1`,
                    [organizer]
                );
            }

            res.json({ message: "Мероприятие создано!", id_event });
        } catch (error) {
            console.error("Ошибка при создании события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEvents(req, res) {
        try {
            const { rows } = await db.query(`
            SELECT e.*, p.name AS place, eo.id_organizer AS organizerId,
                   e."dateStart" AS "dateStart", e."dateEnd" AS "dateEnd"
            FROM event e
            JOIN place p ON e."placeId" = p.id
            LEFT JOIN event_organizer eo ON e.id = eo.id_event
        `);
            if (!rows.length) return res.json([]);

            const host = req.protocol + '://' + req.get('host');
            const ids = rows.map(e => e.id);
            const { rows: tagsRes } = await db.query(
                `SELECT et.id_event,
                    json_agg(json_build_object('id', t.id, 'name', t.name) ORDER BY t.name) AS tags
             FROM event_tag et
             JOIN tag t ON et.id_tag = t.id
             WHERE et.id_event = ANY($1::int[])
             GROUP BY et.id_event`,
                [ids]
            );
            const tagsMap = Object.fromEntries(tagsRes.map(r => [r.id_event, r.tags]));

            const enriched = rows.map(e => {
                const { organizerid, dateStart, dateEnd, ...rest } = e;
                return {
                    ...rest,
                    dateStart,
                    dateEnd,
                    image: `${host}/static/${e.image}`,
                    place: e.place,
                    organizerId: organizerid,
                    tags: tagsMap[e.id] || []
                };
            });

            res.json(enriched);
        } catch (error) {
            console.error("Ошибка при получении событий:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsFromCity(req, res) {
        try {
            const { id } = req.params;
            const countEvents = parseInt(req.query.countEvents) || 10;

            const { rows } = await db.query(`
            SELECT e.*, p.name AS place, eo.id_organizer AS organizerId,
                   e."dateStart" AS "dateStart", e."dateEnd" AS "dateEnd"
            FROM event e
            JOIN place p ON e."placeId" = p.id
            LEFT JOIN event_organizer eo ON e.id = eo.id_event
            WHERE e."cityId" = $1 AND e."dateStart" > NOW()
            ORDER BY e."dateStart" ASC
            LIMIT $2
        `, [id, countEvents]);

            if (!rows.length)
                return res.status(404).json({ message: "В этом городе нет будущих событий" });

            const host = req.protocol + '://' + req.get('host');
            const ids = rows.map(e => e.id);
            const { rows: tagsRes } = await db.query(
                `SELECT et.id_event,
                    json_agg(json_build_object('id', t.id, 'name', t.name) ORDER BY t.name) AS tags
             FROM event_tag et
             JOIN tag t ON et.id_tag = t.id
             WHERE et.id_event = ANY($1::int[])
             GROUP BY et.id_event`,
                [ids]
            );
            const tagsMap = Object.fromEntries(tagsRes.map(r => [r.id_event, r.tags]));

            const enriched = rows.map(e => {
                const { organizerid, dateStart, dateEnd, ...rest } = e;
                return {
                    ...rest,
                    dateStart,
                    dateEnd,
                    image: `${host}/static/${e.image}`,
                    place: e.place,
                    organizerId: organizerid,
                    tags: tagsMap[e.id] || []
                };
            });

            res.json(enriched);
        } catch (error) {
            console.error("Ошибка при получении событий:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsByArtist(req, res) {
        try {
            const { id } = req.params;
            const { rows } = await db.query(`
            SELECT e.*, p.name AS place, eo.id_organizer AS organizerId,
                   e."dateStart" AS "dateStart", e."dateEnd" AS "dateEnd"
            FROM event e
            JOIN event_artist ea ON e.id = ea.id_event
            JOIN place p ON e."placeId" = p.id
            LEFT JOIN event_organizer eo ON e.id = eo.id_event
            WHERE ea.id_artist = $1
        `, [id]);
            if (!rows.length) return res.status(404).json({ message: "У этого артиста нет событий" });

            const host = req.protocol + '://' + req.get('host');
            const ids = rows.map(e => e.id);
            const { rows: tagsRes } = await db.query(
                `SELECT et.id_event,
                    json_agg(json_build_object('id', t.id, 'name', t.name) ORDER BY t.name) AS tags
             FROM event_tag et
             JOIN tag t ON et.id_tag = t.id
             WHERE et.id_event = ANY($1::int[])
             GROUP BY et.id_event`,
                [ids]
            );
            const tagsMap = Object.fromEntries(tagsRes.map(r => [r.id_event, r.tags]));

            const enriched = rows.map(e => {
                const { organizerid, dateStart, dateEnd, ...rest } = e;
                return {
                    ...rest,
                    dateStart,
                    dateEnd,
                    image: `${host}/static/${e.image}`,
                    place: e.place,
                    organizerId: organizerid,
                    tags: tagsMap[e.id] || []
                };
            });

            res.json(enriched);
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsByOrganizer(req, res) {
        try {
            const { id } = req.params;
            const { rows } = await db.query(`
            SELECT e.*, p.name AS place, eo.id_organizer AS organizerId,
                   e."dateStart" AS "dateStart", e."dateEnd" AS "dateEnd"
            FROM event e
            JOIN event_organizer eo ON e.id = eo.id_event
            JOIN place p ON e."placeId" = p.id
            WHERE eo.id_organizer = $1
        `, [id]);
            if (!rows.length) return res.status(404).json({ message: "У этого организатора нет событий" });

            const host = req.protocol + '://' + req.get('host');
            const ids = rows.map(e => e.id);
            const { rows: tagsRes } = await db.query(
                `SELECT et.id_event,
                    json_agg(json_build_object('id', t.id, 'name', t.name) ORDER BY t.name) AS tags
             FROM event_tag et
             JOIN tag t ON et.id_tag = t.id
             WHERE et.id_event = ANY($1::int[])
             GROUP BY et.id_event`,
                [ids]
            );
            const tagsMap = Object.fromEntries(tagsRes.map(r => [r.id_event, r.tags]));

            const enriched = rows.map(e => {
                const { organizerid, dateStart, dateEnd, ...rest } = e;
                return {
                    ...rest,
                    dateStart,
                    dateEnd,
                    image: `${host}/static/${e.image}`,
                    place: e.place,
                    organizerId: organizerid,
                    tags: tagsMap[e.id] || []
                };
            });

            res.json(enriched);
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsByTag(req, res) {
        try {
            const { id } = req.params;
            const { rows } = await db.query(`
            SELECT e.*, p.name AS place, eo.id_organizer AS organizerId,
                   e."dateStart" AS "dateStart", e."dateEnd" AS "dateEnd"
            FROM event e
            JOIN event_tag et ON e.id = et.id_event
            JOIN place p ON e."placeId" = p.id
            LEFT JOIN event_organizer eo ON e.id = eo.id_event
            WHERE et.id_tag = $1
        `, [id]);
            if (!rows.length) return res.status(404).json({ message: "Событий с этим тегом нет" });

            const host = req.protocol + '://' + req.get('host');
            const ids = rows.map(e => e.id);
            const { rows: tagsRes } = await db.query(
                `SELECT et.id_event,
                    json_agg(json_build_object('id', t.id, 'name', t.name) ORDER BY t.name) AS tags
             FROM event_tag et
             JOIN tag t ON et.id_tag = t.id
             WHERE et.id_event = ANY($1::int[])
             GROUP BY et.id_event`,
                [ids]
            );
            const tagsMap = Object.fromEntries(tagsRes.map(r => [r.id_event, r.tags]));

            const enriched = rows.map(e => {
                const { organizerid, dateStart, dateEnd, ...rest } = e;
                return {
                    ...rest,
                    dateStart,
                    dateEnd,
                    image: `${host}/static/${e.image}`,
                    place: e.place,
                    organizerId: organizerid,
                    tags: tagsMap[e.id] || []
                };
            });

            res.json(enriched);
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getOneEvent(req, res) {
        try {
            const { id } = req.params;
            const { rows } = await db.query(`
            SELECT e.*, p.name AS place, eo.id_organizer AS organizerId,
                   e."dateStart" AS "dateStart", e."dateEnd" AS "dateEnd"
            FROM event e
            JOIN place p ON e."placeId" = p.id
            LEFT JOIN event_organizer eo ON e.id = eo.id_event
            WHERE e.id = $1
        `, [id]);
            if (!rows.length) return res.status(404).json({ message: "Событие не найдено" });

            const event = rows[0];
            const host = req.protocol + '://' + req.get('host');
            const { organizerid, dateStart, dateEnd, ...rest } = event;
            const { rows: tagsRes } = await db.query(
                `SELECT t.id, t.name FROM event_tag et
             JOIN tag t ON et.id_tag = t.id
             WHERE et.id_event = $1
             ORDER BY t.name`,
                [id]
            );
            const enrichedEvent = {
                ...rest,
                dateStart,
                dateEnd,
                image: `${host}/static/${event.image}`,
                place: event.place,
                organizerId: organizerid,
                tags: tagsRes
            };

            res.json(enrichedEvent);
        } catch (error) {
            console.error("Ошибка при получении события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsByDateAsc(req, res) {
        try {
            const { cityId } = req.query;
            const params = [];
            let whereClause = '';

            if (cityId) {
                params.push(cityId);
                whereClause = 'WHERE "cityId" = $1';
            }

            const { rows } = await db.query(`
            SELECT * FROM event
            ${whereClause}
            ORDER BY 
                CASE WHEN "dateStart" IS NULL THEN 1 ELSE 0 END,
                "dateStart" ASC,
                "cityId" ASC
        `, params);

            const grouped = {};
            const host = req.protocol + '://' + req.get('host');

            for (const event of rows) {
                const { rows: tagsRes } = await db.query(
                    `SELECT t.id, t.name FROM event_tag et
                 JOIN tag t ON et.id_tag = t.id
                 WHERE et.id_event = $1
                 ORDER BY t.name`,
                    [event.id]
                );
                event.tags = tagsRes;

                const { rows: placeRows } = await db.query(
                    `SELECT name FROM place WHERE id = $1`,
                    [event.placeId]
                );
                event.place = placeRows[0]?.name || null;

                if (event.image) {
                    event.image = `${host}/static/${event.image}`;
                }

                let dateOnly = null;
                if (event.dateStart) {
                    dateOnly = new Date(event.dateStart).toISOString().split('T')[0];
                }

                if (!grouped[dateOnly]) {
                    grouped[dateOnly] = [];
                }

                grouped[dateOnly].push(event);
            }

            const result = Object.keys(grouped)
                .sort((a, b) => {
                    if (a === 'null') return 1;
                    if (b === 'null') return -1;
                    return new Date(a) - new Date(b);
                })
                .map(date => ({
                    date: date === 'null' ? null : date,
                    events: grouped[date].sort((a, b) => {
                        if (!a.dateStart) return 1;
                        if (!b.dateStart) return -1;
                        return new Date(a.dateStart) - new Date(b.dateStart);
                    })
                }));

            res.json(result);
        } catch (error) {
            console.error("Ошибка при получении событий:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getEventsByIds(req, res) {
        try {
            const { ids } = req.body; // ожидается массив id
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: "Неверный формат ids" });
            }

            const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
            const result = await pool.query(`SELECT * FROM event WHERE id IN (${placeholders})`, ids);

            res.json(result.rows);
        } catch (error) {
            console.error("Ошибка при получении событий по ids:", error);
            res.status(500).json({ error: "Ошибка при получении событий по ids" });
        }
    }

    async getEventsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Необходимо указать startDate и endDate" });
            }

            const result = await pool.query(
                `SELECT * FROM event WHERE date BETWEEN $1 AND $2`,
                [startDate, endDate]
            );

            res.json(result.rows);
        } catch (error) {
            console.error("Ошибка при получении событий по диапазону дат:", error);
            res.status(500).json({ error: "Ошибка при получении событий по датам" });
        }
    }



    async updateEvent(req, res) {
        try {
            const { id, description, title, placeId, cityId, dateStart, dateEnd, price } = req.body;

            if (!id || !description || !title || !placeId || !cityId || !dateStart || !dateEnd || !price) {
                return res.status(400).json({ message: "Все поля обязательны для обновления" });
            }

            const parsedPlaceId = parseInt(placeId);
            const parsedCityId = parseInt(cityId);
            const parsedPrice = parseInt(price);
            const parsedId = parseInt(id);

            if (isNaN(parsedPlaceId) || isNaN(parsedCityId) || isNaN(parsedPrice) || isNaN(parsedId)) {
                return res.status(400).json({ message: "Некорректные числовые значения" });
            }

            const { rows } = await db.query(
                `UPDATE event 
                 SET description = $1, title = $2, "placeId" = $3, "cityId" = $4, "dateStart" = $5, "dateEnd" = $6, price = $7 
                 WHERE id = $8 
                 RETURNING *`,
                [description, title, parsedPlaceId, parsedCityId, dateStart, dateEnd, parsedPrice, parsedId]
            );

            if (!rows.length) {
                return res.status(404).json({ message: "Событие не найдено" });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error("Ошибка при обновлении события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            await db.query(`DELETE FROM event_artist WHERE id_event=$1`, [id]);
            await db.query(`DELETE FROM event_tag WHERE id_event=$1`, [id]);
            await db.query(`DELETE FROM event_organizer WHERE id_event=$1`, [id]);

            const { rows } = await db.query(`DELETE FROM event WHERE id=$1 RETURNING *`, [id]);
            if (!rows.length) return res.status(404).json({ message: "Событие не найдено" });

            const imageFilename = rows[0].image;
            if (imageFilename) {
                const imagePath = path.join(__dirname, '..', 'static', imageFilename);
                try { await fs.unlink(imagePath); } catch { }
            }
            res.json({ message: "Событие удалено" });
        } catch (error) {
            console.error("Ошибка при удалении события:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default new EventController();
