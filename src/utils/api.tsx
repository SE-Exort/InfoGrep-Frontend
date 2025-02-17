// Base URLs for each service
export const AUTH_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_BASE_URL || "http://localhost:4000";
export const CHAT_API_BASE_URL =
  process.env.REACT_APP_CHAT_API_BASE_URL || "http://localhost:8003/api";
export const FILE_API_BASE_URL =
  process.env.REACT_APP_FILE_API_BASE_URL || "http://localhost:8002/api";

interface AuthResponse {
  data?: string;
  error?: boolean;
  status?: string;
}

export const authenticateUser = async (
  type: "login" | "register",
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    if (type === "register" && (!username || !password)) {
      throw new Error("Please fill out all fields");
    }

    const response = await fetch(`${AUTH_API_BASE_URL}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Request failed");

    const data = await response.json();
    if (data.error) throw new Error(data.status);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, status: error.message };
    }
    return { error: true, status: "An unknown error occurred" };
  }
};
