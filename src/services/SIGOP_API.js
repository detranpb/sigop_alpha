import axios from "axios";
 
export const SIGOP_API = axios.create({
    baseURL: 'http://184.72.238.232/policiamento/policiamento-services.php',
    /* headers: {
        Authorization: "Bearer {token}"
    }*/
})