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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})