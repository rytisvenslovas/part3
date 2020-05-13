const mongoose = require('mongoose')
require('dotenv').config()
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('connecting to mongoDB')

mongoose.connect(url, {
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(() => {
  console.log('connected to mongoDB')
}).catch((error) => {
  console.log('error connecting to mongo:', error.message)
})

const personSchema = new mongoose.Schema({
  name:{
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number:{
    type:String,
    minlength:8,
    required:true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

  }
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)