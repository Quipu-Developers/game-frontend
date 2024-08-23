import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// /game-end API 호출
export const getGameEndInfo = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/game-end`, {
      params: { userId },
      headers: {
        Accept: "application/json",
      },
    });
    return response.data; // 성공 시 JSON 데이터 반환
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Error fetching game end info:",
        error.response.data.message
      );
    } else {
      console.error("Unknown error:", error.message);
    }
    return null;
  }
};

// /create-user API 호출
export const createUser = async (userName, phoneNumber) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create-user`,
      { userName, phoneNumber },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 성공 시 JSON 데이터 반환 (예: { userId: 123 })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error creating user:", error.response.data.message);
    } else {
      console.error("Unknown error:", error.message);
    }
    return null;
  }
};

// /delete-user API 호출
export const deleteUser = async (userId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/delete-user`,
      { userId },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 성공 시 JSON 데이터 반환 (예: { success: true })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error deleting user:", error.response.data.message);
    } else {
      console.error("Unknown error:", error.message);
    }
    return null;
  }
};

// /update-user API 호출
export const updateUser = async (userId, info) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/update-user`,
      { userId, info },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 성공 시 JSON 데이터 반환 (예: { success: true })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error updating user:", error.response.data.message);
    } else {
      console.error("Unknown error:", error.message);
    }
    return null;
  }
};
