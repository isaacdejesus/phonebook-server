const { response } = require('express')
const logger = require('morgan')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Record = require('./models/record.js')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
logger('tiny')
app.use(logger('combined'))

app.get('/', (request, response) => {
    response.send('Home page')
})

app.get('/api/records', (request, response) => {
    Record.find({}).then(records => {
        response.json(records)
    })
})
app.get('/api/records/:id', (request, response, next) => {
    Record.findById(request.params.id)
        .then(record => {
            if(record)
                response.json(record)
            else
                response.status(404).end()
    })
        .catch(error => next(error))
    })
app.delete('/api/records/:id', (request, response, next) => {
    Record.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end() 
        })
        .catch(error => next(error))
})
app.post('/api/records', (request, response) => {
    const body = request.body
    if(body.name === undefined|| body.number ===undefined){
        return response.status(400).json({
            error: 'content missing'
        })
    }
        const record = new Record( {
        name: body.name,
        number: body.number
    })
    record.save().then(savedRecord => {
        response.json(savedRecord)
    })
    .catch(error => next(error))
})
const generateId = () => {
    return  Math.floor(Math.random() * 92837983798)
}
app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${records.length} people
        <p>${new Date()}</p>`

    )
})
app.put('/api/records/:id', (request, response, next) => {
    const body = request.body
    const record = {
        name: body.name,
        number: body.number,
    }

    Record.findByIdAndUpdate(request.params.id, record, {new: true, runValidators: true})
        .then(updatedRecord => {
            response.json(updatedRecord)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
