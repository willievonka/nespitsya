import express from 'express'
import cityRouter from './routes/city.routes.js'
import tagRouter from './routes/tag.routes.js'
import eventRouter from './routes/event.routes.js'
import artistRouter from './routes/artist.route.js'
import placeRouter from './routes/place.route.js'
import authRouter from './routes/auth.route.js'
import organizerRouter from './routes/organizer.routes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'

const swaggerFile = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf8'))

const PORT = 5000;
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json())

const start = () => {
    try {
        app.use('/static', express.static(path.join(__dirname, 'static')));
        app.use('/api', cityRouter)
        app.use('/api', tagRouter)
        app.use('/api', eventRouter)
        app.use('/api', artistRouter)
        app.use('/api', placeRouter)
        app.use('/api', organizerRouter)
        app.use('/auth', authRouter)
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

        app.listen(PORT, () => console.log('SERVER' + PORT))
    } catch (e) {
        console.log(e)
    }
}

start()


