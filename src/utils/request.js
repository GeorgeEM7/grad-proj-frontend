import axios from "axios";

const BASE_URL = axios.create({ baseURL: "http://localhost:8000" });

export default BASE_URL;
