import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? "/" : 'http://localhost:8080/api/',
    timeout: 1000
})

instance.interceptors.response.use((res) => {
    return Promise.resolve(res);
}, (err) => {
    return Promise.reject(err.response);
});

export default instance;