import db from '../db.js';

class PlaceController {
    async createPlace(req, res) {
        try {
            const { name, cityId, lat, lon } = req.body;
    
            if (!name || !cityId || lat === undefined || lon === undefined) {
                return res.status(400).json({ message: "Поля name, cityId, lat и lon обязательны!" });
            }
    
            let cityName = null;
            const city = await db.query("SELECT name FROM city WHERE id = $1", [cityId]);
            if (city.rows.length > 0) {
                cityName = city.rows[0].name;
            } else {
                return res.status(400).json({ message: "Город с таким ID не найден!" });
            }
    
            const newPlace = await db.query(
                `INSERT INTO place (name, cityId, cityName, lat, lon) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [name, cityId, cityName, lat, lon]
            );
    
            res.json(newPlace.rows[0]);
        } catch (error) {
            console.error("Ошибка при создании места:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
    
    async getPlaces(req, res) {
        try {
            const places = await db.query(`
                SELECT 
                    place.id,
                    place.name,
                    place.lat,
                    place.lon,
                    CASE 
                        WHEN city.id IS NOT NULL THEN json_build_object(
                            'id', city.id,
                            'name', city.name,
                            'regionName', city."regionName",
                            'shortName', city."shortName",
                            'backgroundUrl', city."backgroundUrl"
                        )
                        ELSE NULL
                    END AS city
                FROM place
                LEFT JOIN city ON place.cityId = city.id
            `);
    
            res.json(places.rows);
        } catch (error) {
            console.error("Ошибка при получении мест:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
    
    async getOnePlace(req, res) {
        try {
            const { id } = req.params;
            const place = await db.query(`
                SELECT 
                    place.id,
                    place.name,
                    place.lat,
                    place.lon,
                    CASE 
                        WHEN city.id IS NOT NULL THEN json_build_object(
                            'id', city.id,
                            'name', city.name,
                            'regionName', city."regionName",
                            'shortName', city."shortName",
                            'backgroundUrl', city."backgroundUrl"
                        )
                        ELSE NULL
                    END AS city
                FROM place
                LEFT JOIN city ON place.cityId = city.id
                WHERE place.id = $1
            `, [id]);
    
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
            const { id, name, cityId, lat, lon } = req.body;
    
            if (!id || !name || lat === undefined || lon === undefined) {
                return res.status(400).json({ message: "Поля id, name, lat и lon обязательны для обновления!" });
            }
    
            let cityName = null;
            if (cityId) {
                const city = await db.query("SELECT name FROM city WHERE id = $1", [cityId]);
                if (city.rows.length > 0) {
                    cityName = city.rows[0].name;
                } else {
                    return res.status(400).json({ message: "Город с таким ID не найден!" });
                }
            }
    
            const place = await db.query(
                `UPDATE place 
                 SET name = $1, cityId = $2, cityName = $3, lat = $4, lon = $5
                 WHERE id = $6 
                 RETURNING *`,
                [name, cityId || null, cityName, lat, lon, id]
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
