import axios from "axios";
import { isDevelopment } from "../config";

export const httpClient = axios.create({
  baseURL: isDevelopment ? "http://192.168.89.118:5680" : undefined,
});

export default httpClient;
