import axios from 'axios'

const Api = axios.create({
    baseURL:"https://sea-lion-app-5eziv.ondigitalocean.app"
    // baseURL:'http://127.0.0.1:8000/'
});

export default Api