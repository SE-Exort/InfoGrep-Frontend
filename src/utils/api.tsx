import * as endpointsProd from "./endpointsProd"
import * as endpointsDev from "./endpointsDev"

let endpoints = null
if (process.env.REACT_APP_INFOGREP_ENV === "production") {
  endpoints = endpointsProd
}
else {
  endpoints = endpointsDev
}

export const AI_API_BASE_URL = endpoints.AI_API_BASE_URL

export const AUTH_API_BASE_URL = endpoints.AUTH_API_BASE_URL

export const FILE_API_BASE_URL = endpoints.FILE_API_BASE_URL

export const CHAT_API_BASE_URL = endpoints.CHAT_API_BASE_URL

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

export interface ChatroomListItem {
  CHATROOM_UUID: string;
  CHATROOM_NAME: string;
}

// ================================
// Authentication API functions for login, register, and logout
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

export const checkUser = async (session: string) => {
  console.log("Check user API called with session:", session);
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionToken: session
      })
    });

    if (!response.ok) {
      return {
        error: true
      }
    }

    const data = await response.json();
    console.log("Check user API response:", data, Boolean(data.is_admin)); // Log raw response

    return {
      id: data.id ?? "",
      // Force boolean conversion to handle any non-boolean values
      is_admin: Boolean(data.is_admin),
      error: false,
      changePasswordWarning: Boolean(data.changePasswordWarning)
    };
  } catch (error) {
    console.error("Check user error:", error);
    return {
      id: "",
      error: false,
      is_admin: false,
      changePasswordWarning: false
    };
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    console.log("OK: Logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// ================================
// Chat API functions
// ================================
export const fetchChatroom = async (
  chatroomUUID: string,
  session: string
): Promise<{
  list: { User_UUID: string, Message: string }[];
  embedding_model: string;
  embedding_provider: string;
  chat_model: string;
  chat_provider: string;
}> => {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/room?` +
      new URLSearchParams({
        chatroom_uuid: chatroomUUID,
        cookie: session,
      }).toString(),
      { method: "GET" }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching chatroom:", error);
    return { list: [], embedding_model: '', embedding_provider: '', chat_model: '', chat_provider: '' };
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

export const parseFile = async (
  chatroomUUID: string,
  session: string,
  fileUUID: string
): Promise<void> => {
  try {
    await fetch(
      `${AI_API_BASE_URL}/parse_file?` +
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

export const fetchFiles = async (
  chatroomUUID: string,
  session: string
): Promise<BackendFile[]> => {
  try {
    const response = await fetch(
      `${FILE_API_BASE_URL}/filelist?` +
      new URLSearchParams({
        chatroom_uuid: chatroomUUID,
        cookie: session,
      }).toString(),
      { method: "GET" }
    );
    return (await response.json()).list;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
};

export const deleteFile = async (
  chatroomUUID: string,
  session: string,
  fileUUID: string
): Promise<void> => {
  try {
    await fetch(
      `${FILE_API_BASE_URL}/file?` +
      new URLSearchParams({
        chatroom_uuid: chatroomUUID,
        cookie: session,
        file_uuid: fileUUID,
      }).toString(),
      { method: "DELETE" }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const removeEmbedding = async (
  chatroomUUID: string,
  session: string,
  fileUUID: string
): Promise<void> => {
  try {
    await fetch(
      `${AI_API_BASE_URL}/remove_embedding`,
      {
        method: "POST",
        body: JSON.stringify({
          chatroom_uuid: chatroomUUID,
          sessionToken: session,
          file_uuid: fileUUID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error removing embedding", error);
  }
};

export const fetchFileDownload = async (
  chatroomUUID: string,
  session: string,
  file: BackendFile
): Promise<void> => {
  try {
    const response = await fetch(
      `${FILE_API_BASE_URL}/file?` +
      new URLSearchParams({
        chatroom_uuid: chatroomUUID,
        cookie: session,
        file_uuid: file.File_UUID,
      }).toString(),
      { method: "GET" }
    );

    if (!response.ok) {
      console.error("Error fetching the file:", response.statusText);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${file.File_Name}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

// ================================
// Chatroom API Functions
// ================================
export const fetchChatrooms = async (session: string): Promise<ChatroomListItem[]> => {
  try {
    console.log("Fetching chatrooms...");
    const response = await fetch(
      `${CHAT_API_BASE_URL}/rooms?` +
      new URLSearchParams({ cookie: session }).toString(),
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.status);
    }
    console.log("Chatroom fetch successful:", data.list);

    return data.list.map(
      (room: { CHATROOM_UUID: string; CHATROOM_NAME: string }) => ({
        CHATROOM_UUID: room.CHATROOM_UUID,
        CHATROOM_NAME: room.CHATROOM_NAME,
      })
    );
  } catch (error) {
    console.error("Chatroom fetch error:", error);
    return [];
  }
};

export const createChatroom = async (
  session: string,
  chatroomName: string,
  chat_model: string,
  chat_provider: string,
  embedding_model: string,
  embedding_provider: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/room?` + new URLSearchParams({ cookie: session, embedding_model, chat_model, chat_provider, embedding_provider, chatroom_name: chatroomName }).toString(),
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.status);
    }
    return data.id;
  } catch (error) {
    console.error("Chatroom creation error:", error);
    return null;
  }
};

export const deleteChatroom = async (
  session: string,
  chatroomUUID: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/room?` +
      new URLSearchParams({
        chatroom_uuid: chatroomUUID,
        cookie: session,
      }).toString(),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          chatroom_uuid: chatroomUUID,
          cookie: session,
        }).toString(),
      }
    );
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.status);
    }
    console.log("Chatroom delete successful:", data);
  } catch (error) {
    console.error("Chatroom deletion error:", error);
  }
};

export const renameChatroom = async (session: string, chatroomID: string, newName: string) => {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/roomname?` +
      new URLSearchParams({
        chatroom_uuid: chatroomID,
        new_name: newName,
        cookie: session,
      }),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to rename chatroom");
    }

    return await response.json();
  } catch (error) {
    console.error("Error renaming chatroom:", error);
    throw error;
  }
};

export const changePassword = async (
  sessionImport: string,
  newPassword: string
): Promise<void> => {

  try {

    const response = await fetch(`${AUTH_API_BASE_URL}/user?sessionToken=${sessionImport}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword
      }),
    });

    const data = await response.json();
    if (data.error === false) {
      console.log("Password updated successfully!");
    } else {
      console.warn("Unexpected response:", data.status);
    }
  } catch (err) {
    console.log("An error occurred. Please try again.");
  }
};