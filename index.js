const { response } = require('express')
const express = require('express')
const app = express()
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
app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${records.length} people
        <p>${new Date()}</p>`

    )
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
