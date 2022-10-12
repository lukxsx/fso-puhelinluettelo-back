const express = require('express')
const app = express()

const PORT = 3001

const persons = [
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

app.get('/api/persons', (request, response) => {
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

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>There are ${persons.length} numbers saved in the phonebook.</p>
    <p>${date.toString()}</p>`
  )
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})