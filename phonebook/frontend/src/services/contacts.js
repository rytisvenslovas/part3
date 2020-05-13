import axios from 'axios';


const baseUrl = '/api/persons/'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => {
        return response.data
    })
}


const add = (nameObject) => {
    const request = axios.post(baseUrl , nameObject)
    return request.then(response => {
        return response.data
    })
}

const erase = (id) => {
    const request = axios.delete(`${baseUrl}${id}`)
    return request.then(response=>{
        return response.data
    })
  }
const update = (id, updatedContact) => {
    const request = axios.put(`${baseUrl}${id}`, updatedContact)
    return request.then(response => {
        return response.data
    })
  }

export default {getAll, add, erase, update }