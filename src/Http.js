import axios from 'axios';

const Http = axios.create({
    baseURL: 'https://api.exchangeratesapi.io/'
});

Http.defaults.headers.common['Accept'] = 'application/json';
Http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Http.interceptors.request.use(
    (req) => {
        return req
    },
    (error) => {
        return Promise.reject(error)
    }
);

Http.interceptors.response.use(
    (res) => {
        return res
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default Http;