import axios from "axios";

const api = axios.create({
    // https://88a4bc8c-ee34-4b4f-8049-f82299929461.mock.pstmn.io ==> postman mock server url
    // process.env.REACT_APP_BASE_URL
    baseURL: "http://3.36.174.53:8080", 
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    //withCredentials: true,  // JSESSIONID 포함
});

export default api;

