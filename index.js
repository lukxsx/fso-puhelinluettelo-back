require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())

morgan.token('json', (request, _) => {
    if (request.method === "POST") {
      return JSON.stringify(request.body)
  } else {
    return " "
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

const errorHandler = (error, request, response, next) => {
  console.log("\n\nERROR\n\n")
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const PORT = process.env.PORT

app.get('/api/persons', (_, response) => {
  Person.find({}).then(p => {
    response.json(p)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

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
  
  const person = new Person({ ...request.body})
  console.log(person)
  person.save()
  response.json(person)
})

app.get('/info', (_, response) => {
  const date = new Date()
  response.send(
    `<p>There are ${persons.length} numbers saved in the phonebook.</p>
    <p>${date.toString()}</p>`
  )
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})