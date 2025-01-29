import axios from "axios";

const api = axios.create({
    baseURL: "https://88a4bc8c-ee34-4b4f-8049-f82299929461.mock.pstmn.io",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;