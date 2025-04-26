import db from '../db.js';

class CityController {
    async createCity(req, res) {
        const { name, regionName, shortName } = req.body;
        const backgroundUrl = req.file?.filename;

        if (!name || !regionName || !shortName || !backgroundUrl) {
            return res.status(400).json({ error: 'Поля "name", "regionName", "shortName" и изображение обязательны' });
        }

        try {
            const newCity = await db.query(
                'INSERT INTO city (name, "regionName", "shortName", "backgroundUrl") VALUES ($1, $2, $3, $4) RETURNING *',
                [name, regionName, shortName, backgroundUrl]
            );
            res.status(201).json(newCity.rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    async getCityById(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Параметр "id" обязателен' });
        }

        try {
            const city = await db.query(
                'SELECT * FROM city WHERE id = $1',
                [id]
            );
            if (city.rows.length === 0) {
                return res.status(404).json({ message: 'Город не найден' });
            }

            const host = req.protocol + '://' + req.get('host');
            const enrichedCity = {
                ...city.rows[0],
                backgroundUrl: `${host}/static/${city.rows[0].backgroundUrl}`
            };

            res.json(enrichedCity);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    async getRegionsList(req, res) {
        try {
            const result = await db.query(`
                SELECT
                    LEFT(c."regionName", 1) AS letter,
                    c."regionName" AS region_name,
                    c.id AS city_id,
                    c.name AS city_name,
                    c."shortName",
                    c."backgroundUrl"
                FROM city c
                ORDER BY letter, region_name, city_name;
            `);

            const regionsList = [];
            result.rows.forEach(row => {

                let regionGroup = regionsList.find(group => group.name === row.letter);
                if (!regionGroup) {
                    regionGroup = { name: row.letter, regions: [] };
                    regionsList.push(regionGroup);
                }

                let region = regionGroup.regions.find(r => r.name === row.region_name);
                if (!region) {
                    region = { name: row.region_name, cities: [] };
                    regionGroup.regions.push(region);
                }

                const host = req.protocol + '://' + req.get('host');

                region.cities.push({
                    id: row.city_id,
                    name: row.city_name,
                    shortname: row.shortname,
                    backgroundUrl: `${host}/static/${row.backgroundUrl}`
                });
            });

            res.json(regionsList);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async getTopCities(req, res) {
        try {
            // Массив городов, которые нужно вернуть
            const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Нижний Новгород'];
    
            // Формируем строку запроса с параметрами
            const query = `
                SELECT * FROM city
                WHERE name IN ($1, $2, $3, $4, $5)
            `;
    
            // Выполняем запрос
            const result = await db.query(query, cities);
    
            // Если города не найдены
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Города не найдены' });
            }
            
            const host = req.protocol + '://' + req.get('host');
            
            // Добавляем хост к изображениям
            const citiesWithHost = result.rows.map(city => ({
                ...city,
                backgroundUrl: `${host}/static/${city.backgroundUrl}`
            }));
    
            // Отправляем результат
            res.json(citiesWithHost);
        } catch (error) {
            console.error("Ошибка при получении городов:", error);
            res.status(500).json({ error: error.message });
        }
    }


    async updateCity(req, res) {
        const { id } = req.params;
        const { name, regionName, shortName } = req.body;

        // Получаем файл изображения (если он есть)
        const backgroundUrl = req.file ? req.file.filename : null;  // Сохраняем только имя файла, без пути

        if (!id) {
            return res.status(400).json({ error: 'Параметр "id" обязателен' });
        }

        try {
            const result = await db.query(
                `UPDATE city 
                     SET 
                         name = COALESCE($1, name),
                         "regionName" = COALESCE($2, "regionName"),
                         "shortName" = COALESCE($3, "shortName"),
                         "backgroundUrl" = COALESCE($4, "backgroundUrl")
                     WHERE id = $5 RETURNING *`,
                [name, regionName, shortName, backgroundUrl, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Город не найден' });
            }

            res.json(result.rows[0]);
        } catch (err) {
            console.error("Ошибка при обновлении города:", err);
            res.status(500).json({ error: err.message });
        }
    }



    async deleteCity(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Параметр "id" обязателен' });
        }

        try {
            const deleted = await db.query(
                "DELETE FROM city WHERE id = $1 RETURNING *",
                [id]
            );
            if (deleted.rows.length === 0) {
                return res.status(404).json({ message: 'Город не найден' });
            }
            res.json({ message: 'Город удалён', city: deleted.rows[0] });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

export default new CityController();
