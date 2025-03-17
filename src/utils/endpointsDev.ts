const PROTOCOL = "http://";
const HOST = "localhost";

// Base URLs for each service

export const AUTH_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_BASE_URL || `${PROTOCOL}${HOST}:4000`;

export const FILE_API_BASE_URL =
  process.env.REACT_APP_FILE_API_BASE_URL || `${PROTOCOL}${HOST}:8002/api`;

export const CHAT_API_BASE_URL =
  process.env.REACT_APP_CHAT_API_BASE_URL || `${PROTOCOL}${HOST}:8003/api`;

export const AI_API_BASE_URL =
  process.env.REACT_APP_AI_API_BASE_URL || `${PROTOCOL}${HOST}:8004/api`;