import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        title: 'Event API',
        description: 'Документация API событий'
    },
    host: 'localhost:5000',
    schemes: ['http']
}

const outputFile = './swagger-output.json'
const routes = ['./routes/*.js'] 

swaggerAutogen()(outputFile, routes)
