const mongoose = require('mongoose')


if (process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const url = `mongodb+srv://rytis:${password}@cluster0-dihxu.mongodb.net/phonebook-app?retryWrites=true&w=majority`


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]

})


if(!process.argv[3] || !process.argv[4]){
    Person.find({}).then(res=>{
        console.log('phonebook:')
        res.forEach(person=>{
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })      
}else {
    person.save().then(res=>{ 
        console.log(`added name: ${res.name} number: ${res.number} to phonebook`)
        mongoose.connection.close()
     })
}


