import axios from "axios";
import { isDevelopment } from "../config";

export const httpClient = axios.create({
  baseURL: isDevelopment ? "https://tender.infinia.com.tr" : undefined,
});

export default httpClient;
