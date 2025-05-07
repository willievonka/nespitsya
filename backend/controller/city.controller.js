import db from '../db.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getCoordinates(cityName) {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            q: cityName,
            format: 'json',
            limit: 1
        },
        headers: { 'User-Agent': 'YourAppNameHere' }
    });

    if (!response.data.length) {
        throw new Error('Город не найден');
    }

    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

async function updateAllCitiesCoordinates() {
    const result = await db.query('SELECT id, name FROM city WHERE latitude IS NULL OR longitude IS NULL');

    for (const city of result.rows) {
        const coords = await getCoordinates(city.name);
        if (!coords) {
            console.warn(`Не удалось найти координаты для города "${city.name}"`);
            continue;
        }

        await db.query(
            'UPDATE city SET latitude = $1, longitude = $2 WHERE id = $3',
            [coords.lat, coords.lon, city.id]
        );

        console.log(`Обновлено: ${city.name} → ${coords.lat}, ${coords.lon}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Готово!');
}

class CityController {
    async createCity(req, res) {
        const { name, regionName, shortName } = req.body;
        const backgroundUrl = req.file?.filename;
        const { lat, lon } = await getCoordinates(name);

        if (!name || !regionName || !shortName || !backgroundUrl) {
            return res.status(400).json({ error: 'Поля "name", "regionName", "shortName" и изображение обязательны' });
        }

        try {
            const newCity = await db.query(
                'INSERT INTO city (name, "regionName", "shortName", "backgroundUrl", latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [name, regionName, shortName, backgroundUrl, lat, lon]
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
                const isFederalCity = row.region_name === row.city_name;
    
                // Первая буква
                const groupLetter = row.letter;
    
                const regionName = isFederalCity ? `${row.city_name} (г. фед. знач.)` : row.region_name;
    
                // Находим или создаём группу по первой букве
                let regionGroup = regionsList.find(group => group.name === groupLetter);
                if (!regionGroup) {
                    regionGroup = { name: groupLetter, regions: [] };
                    regionsList.push(regionGroup);
                }
    
                // Находим или создаём регион внутри группы
                let region = regionGroup.regions.find(r => r.name === regionName);
                if (!region) {
                    region = { name: regionName, cities: [] };
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
            // Топ городов
            const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Нижний Новгород'];

            const query = `
                SELECT * FROM city
                WHERE name IN ($1, $2, $3, $4, $5)
            `;
            const result = await db.query(query, cities);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Города не найдены' });
            }

            const host = req.protocol + '://' + req.get('host');

            const citiesWithHost = result.rows.map(city => ({
                ...city,
                backgroundUrl: `${host}/static/${city.backgroundUrl}`
            }));

            res.json(citiesWithHost);
        } catch (error) {
            console.error("Ошибка при получении городов:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getNearestCity(req, res) {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Параметры "lat" и "lon" обязательны' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Параметры "lat" и "lon" должны быть числами' });
        }

        try {
            const nearestCityQuery = `
            SELECT id, name, latitude, longitude,
                    (
                        6371 * acos(
                            cos(radians($1)) * cos(radians("latitude")) *
                            cos(radians("longitude") - radians($2)) +
                            sin(radians($1)) * sin(radians("latitude"))
                        )
                    ) AS distance
                FROM city
                ORDER BY distance
                LIMIT 1;
            `;

            const result = await db.query(nearestCityQuery, [latitude, longitude]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Ближайший город не найден' });
            }

            res.json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateCity(req, res) {
        const { id } = req.params;
        const { name, regionName, shortName } = req.body;

        const backgroundUrl = req.file ? req.file.filename : null;

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
            const cityResult = await db.query("SELECT * FROM city WHERE id = $1", [id]);
            if (cityResult.rows.length === 0) {
                return res.status(404).json({ message: 'Город не найден' });
            }
            const city = cityResult.rows[0];
            const imagePath = path.join(__dirname, '..', 'static', city.backgroundUrl); 
    
            await db.query("DELETE FROM city WHERE id = $1", [id]);
    
            // Удаляем изображение
            fs.unlink(imagePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Ошибка при удалении изображения:', err);
                }
            });
    
            res.json({ message: 'Город и его изображение удалены', city });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

export default new CityController();
