const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.log('error connecting to mongodb', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty!'],
    minlength: [3, 'Name length must be at least 3 characters!']
  },
  number: {
    type: String,
    required: [true, 'Number cannot be empty!'],
    minlength: [8, 'Number must be at least 8 numbers!'],
    validate: {
      validator: (v) => {
        return /^(\d{2}-\d{6,}|\d{3}-\d{5,})/.test(v)
      },
      message: 'Number must be in format XXX-XXXXX or XX-XXXXXX'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)