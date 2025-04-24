import db from '../db.js';

class CityController {
    async createCity(req, res) {
        const { name, region, shortname } = req.body;
        const backgroundimg = req.file?.filename;

        if (!name || !region || !shortname || !backgroundimg) {
            return res.status(400).json({ error: 'Поля "name", "region", "shortname" и изображение обязательны' });
        }

        try {
            const newCity = await db.query(
                'INSERT INTO city (name, region, shortname, backgroundimg) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, region, shortname, backgroundimg]
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
                backgroundimg: `${host}/static/${city.rows[0].backgroundimg}`
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
                    LEFT(c.region, 1) AS letter,
                    c.region AS region_name,
                    c.id AS city_id,
                    c.name AS city_name,
                    c.shortname,
                    c.backgroundimg
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
                    backgroundimg: `${host}/static/${row.backgroundimg}`
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
    
            // Отправляем результат
            res.json(result.rows);
        } catch (error) {
            console.error("Ошибка при получении городов:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateCity(req, res) {
        const { id } = req.params;
        const { name, region, shortname } = req.body;

        // Получаем файл изображения (если он есть)
        const backgroundimg = req.file ? req.file.filename : null;  // Сохраняем только имя файла, без пути

        if (!id) {
            return res.status(400).json({ error: 'Параметр "id" обязателен' });
        }

        try {
            const result = await db.query(
                `UPDATE city 
                     SET 
                         name = COALESCE($1, name),
                         region = COALESCE($2, region),
                         shortname = COALESCE($3, shortname),
                         backgroundimg = COALESCE($4, backgroundimg)  -- Если backgroundimg null, оставим старое значение
                     WHERE id = $5 RETURNING *`,
                [name, region, shortname, backgroundimg, id]
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
