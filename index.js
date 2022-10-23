const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json', (request, _) => {
    if (request.method === "POST") {
      return JSON.stringify(request.body)
  } else {
    return " "
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

const PORT = process.env.PORT || 3001

let persons = [
  {
    id: 1,
    name: "Example User",
    number: "123-123456"
  },
  {
    id: 2,
    name: "Matti Meikäläinen",
    number: "1122334455"
  },
  {
    id: 3,
    name: "Erkki Esimerkki",
    number: "66339933"
  }
]

app.get('/api/persons', (_, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  // check if person exists
  const person = persons.find(p => p.id === id)
  if (person) {
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const giveFreeRandomId = () => {
  let num = 0
  while (true) {
    num = Math.floor(Math.random() * 1000) + 1
    if (!persons.find(p => p.id === num)) {
      break
    }
  }
  return num
}

app.post('/api/persons', (request, response) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: 'name missing!'
    })
  }
  if (!request.body.number) {
    return response.status(400).json({
      error: 'number missing!'
    })
  }
  if (persons.find(p => p.name === request.body.name)) {
    return response.status(400).json({
      error: 'name is already in the phonebook!'
    })
  }
  
  const person = { ...request.body, id: giveFreeRandomId()}
  console.log(person)
  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (_, response) => {
  const date = new Date()
  response.send(
    `<p>There are ${persons.length} numbers saved in the phonebook.</p>
    <p>${date.toString()}</p>`
  )
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})