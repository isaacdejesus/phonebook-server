const { response } = require('express')
const logger = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
let records =[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
logger('tiny')
app.use(logger('combined'))

app.get('/', (request, response) => {
    response.send('Home page')
})

app.get('/api/records', (request, response) => {
    response.json(records)
})
app.get('/api/records/:id', (request, response) => {
    const id = Number(request.params.id)
    const record = records.find(record => record.id === id)
    if (record)
        response.json(record)
    else
        response.status(404).end()
})
app.delete('/api/records/:id', (request, response) => {
    const id = Number(request.params.id)
    records = records.filter(record => record.id !== id)
   response.status(204).end() 
})
app.post('/api/records', (request, response) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if(records.find(record => record.name === body.name))
    {
        return response.status(400).json({
            error: "name already in phonebook"
        })
    }
    const record = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    records = records.concat(record)
    response.json(record)
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
const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
