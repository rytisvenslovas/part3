import React, { useState, useEffect } from 'react'
import contactService from './services/contacts';


const Persons  = (props) => {
  return (
    <ul>
        {props.namesToShow}
   </ul>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
        <div>
          name: <input 
          value={props.newName}
          onChange={props.handleNameChange}/>
        </div>
        <div>number: <input 
        value={props.newNumber}
        onChange={props.handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
    
  )
}

const Filter = (props) => {
  return (
    <div>
        <input placeholder='search' value={props.newSearch} onChange={props.handleSearchChange}/>
    </div>
  )
}

const Notification = ({message}) => {
  if(message === null ) {
    return null
  }else {
    return (
      <div className="notification">
        {message}
      </div>
    )
  }
}

const ErrorNotification = ({error}) => {
  if(error === null ) {
    return null
  }else {
    return (
      <div className="error">
        {error}
      </div>
    )
  }
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  

  useEffect(() => {
    contactService
    .getAll().then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const addName = (event) => {
    if(persons.find((name)=>{
    return  name.name.toLowerCase() === newName.toLowerCase()
    })){if(window.confirm(`${newName} is allready in the phonebook.Replace the old one with a new one ?`)){
      event.preventDefault()
      const contact =persons.find((name)=>{
        return  name.name.toLowerCase() === newName.toLowerCase()
        })
        const updatedContact = { 
          name: newName,
          number: newNumber
          
        }
      contactService
      .update(contact.id, updatedContact).then(returnedContact => {
        setPersons(persons.map(person => person.id !== contact.id ? person : returnedContact))
        setMessage(`Contact ${returnedContact.name} was updated`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      })
      setNewName('')
      setNewNumber('')
    }else{
      event.preventDefault()
    }
    } else {
      event.preventDefault()
    const nameObject = { 
      name: newName,
      number: newNumber
      
    }
    contactService
    .add(nameObject).then(returnedContact => {
      setPersons(persons.concat(returnedContact))
      setNewName('')
      setNewNumber('')
      setMessage(`Contact ${returnedContact.name} was created`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } ).catch(error=>{
      setError(error.response.data)
      setTimeout(() => {
        setError(null)
      }, 3000)
      console.log(error.response.data)
    })
  }
    }
    
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    console.log(newSearch)
    console.log(event.target.value)
  }
  const  search = persons.filter((person)=> {
    return person.name.toLowerCase().includes(newSearch.toLowerCase())
  })
  
  const namesToShow = search.map((name)=>{
    const deleteContact =() => {
      if (window.confirm(`Are you sure you want to delete ${name.name} `)) { 
      contactService
      .erase(name.id).then(()=>{
        setPersons(persons.filter(person => person.id !== name.id))
        setError(`Contact ${name.name} was deleted`)
      setTimeout(() => {
        setError(null)
      }, 3000)
      }).catch(error => {
        console.log(`Contact ${name.name} was already deleted`)
        setError(`Contact ${name.name} was already deleted`)
      })
      
      }
    }
    return <div key={name.name}>
              <p>{name.name} {name.number}</p>
              <button onClick={deleteContact}>delete {name.name}</button>
            </div>
          
  })

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <ErrorNotification error={error} />
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      <h1>add new</h1>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange}
                  newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h1>Numbers</h1>
      <Persons namesToShow={namesToShow}/>
    </div>
  )
}

export default App