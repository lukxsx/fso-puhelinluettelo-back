require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('json', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  } else {
    return ' '
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

app.get('/api/persons', (request, response) => {
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

app.put('/api/persons/:id', (request, response, next) => {
  const modifiedPerson = {
    ...request.body,
    number: request.body.number,
  }

  Person.findByIdAndUpdate(request.params.id, modifiedPerson, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  
  const person = new Person({ ...request.body})
  console.log(person)
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.count({})
    .then(count => {
      const date = new Date()
      response.send(
        `<p>There are ${count} numbers saved in the phonebook.</p>
    <p>${date.toString()}</p>`)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log('\n\nERROR\n\n')
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
