// Base URLs for each service
export const AUTH_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_BASE_URL || "http://localhost:4000";
export const PARSE_API_BASE_URL =
  process.env.REACT_APP_FILE_API_BASE_URL || "http://localhost:8001/api";
export const FILE_API_BASE_URL =
  process.env.REACT_APP_FILE_API_BASE_URL || "http://localhost:8002/api";
export const CHAT_API_BASE_URL =
  process.env.REACT_APP_CHAT_API_BASE_URL || "http://localhost:8003/api";

// Interfaces for API responses
interface AuthResponse {
  data?: string;
  error?: boolean;
  status?: string;
}
export interface BackendFile {
  File_UUID: string;
  File_Name: string;
}

// ================================
// Authentication API functions
// ================================
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

export const getUUID = async (sessionToken: string): Promise<string | null> => {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/check?`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    });
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    if (data.error) throw new Error(data.status);
    return data.data;
  } catch (error) {
    console.error("UUID error:", error);
    return null;
  }
};

// ================================
// Chat API functions
// ================================
export const fetchMessages = async (
  chatroomUUID: string,
  session: string
): Promise<any[]> => {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/room?` +
        new URLSearchParams({
          chatroom_uuid: chatroomUUID,
          cookie: session,
        }),
      { method: "GET" }
    );
    const data = await response.json();
    return data.list || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const fetchMessageDetails = async (
  chatroomUUID: string,
  messageUUID: string,
  session: string
): Promise<string> => {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/message?` +
        new URLSearchParams({
          chatroom_uuid: chatroomUUID,
          message_uuid: messageUUID,
          cookie: session,
        }),
      { method: "GET" }
    );
    return await response.text();
  } catch (error) {
    console.error("Error fetching message details:", error);
    return "";
  }
};

export const sendMessage = async (
  chatroomUUID: string,
  session: string,
  message: string
): Promise<void> => {
  try {
    await fetch(
      `${CHAT_API_BASE_URL}/message?` +
        new URLSearchParams({
          chatroom_uuid: chatroomUUID,
          cookie: session,
          message: message,
        }).toString(),
      { method: "POST" }
    );
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// ================================
// File API functions
// ================================
export const uploadFile = async (
  chatroomUUID: string,
  session: string,
  file: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("uploadedfile", file);

    const response = await fetch(
      `${FILE_API_BASE_URL}/file?` +
        new URLSearchParams({
          chatroom_uuid: chatroomUUID,
          cookie: session,
        }),
      { method: "POST", body: formData }
    );

    return (await response.text()).replaceAll('"', "");
  } catch (error) {
    console.error("Error uploading file:", error);
    return "";
  }
};

export const startParsing = async (
  chatroomUUID: string,
  session: string,
  fileUUID: string
): Promise<void> => {
  try {
    await fetch(
      `${PARSE_API_BASE_URL}/start_parsing?` +
        new URLSearchParams({
          chatroom_uuid: chatroomUUID,
          cookie: session,
          file_uuid: fileUUID,
          filetype: "PDF",
        }),
      { method: "POST" }
    );
  } catch (error) {
    console.error("Error starting file parsing:", error);
  }
};
