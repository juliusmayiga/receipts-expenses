import axios from 'axios';
import { cacheAdapterEnhancer, Cache } from 'axios-extensions';
import {API_BASE_URL} from "./site-constants";

const Http = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Cache-Control': 'no-cache' },
    adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
        enabledByDefault: false,
        defaultCache: new Cache({ maxAge: 10000 })
    })
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