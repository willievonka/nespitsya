import db from '../db.js';

class CityController {
    async createCity(req, res) {
        const { name, region } = req.body;

        if (!name || !region) {
            return res.status(400).json({ error: 'Поля "name" и "region" обязательны' });
        }

        try {
            const newCity = await db.query(
                'INSERT INTO city (name, region) VALUES ($1, $2) RETURNING *',
                [name, region]
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
            res.json(city.rows[0]);
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
                    c.name AS city_name
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
                region.cities.push({ name: row.city_name });
            });

            res.json(regionsList);
        } catch (err) {
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
