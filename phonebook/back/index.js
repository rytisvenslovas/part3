require('dotenv').config()
const express = require('express')
const app = express()
const  morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req, ) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status - :response-time ms :body' ))

let persons = [
  { 'name': 'Arto Hellas',
    'number': '040-123456',
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': 4
  }
]
let  nr = 0

const updateCount = () => {
  Person.find({}).then(persons => {
    const count = persons.map(person => person)
    nr = count.length
  })
}
updateCount()


app.get('/api/persons', (req, res) => {

  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
    updateCount()
  })
})

app.get('/info', (req, res) => {
  updateCount()
  const date = new Date()
  res.send(`<p> phonebook has info for ${nr} people</p><p>${date}</p>`)

})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if(person){
      res.json(person.toJSON())
      updateCount()
    }else{
      res.status(404).end()
    }

  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(() => {
    updateCount()
    res.status(204).end()
  }).catch(error => next(error))
})

app.use(express.json())

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId +1
}


app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if(!body.name){
    return res.status(400).json({ error: 'name is missing' })
  }else{
    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId()
    })
    console.log(body.name)
    person.save().then(savedPerson => {
      res.json(savedPerson.toJSON())
      updateCount()
    }).catch(error => next(error))
  }



})
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new:true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    }).catch(error => next(error))

})


const unknowEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknowEndpoint)

const errorHandler = (error , req , res, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return res.status(400).send({ error:'wrong id' })
  }else if(error.name === 'ValidationError'){
    return res.status(400).json([error.message])
  }
  next(error)
}

app.use(errorHandler)


const PORT =  process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})