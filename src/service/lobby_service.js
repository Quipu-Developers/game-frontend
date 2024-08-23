import socket from "./socket";

export async function fetchRooms() {
  return new Promise((resolve, reject) => {
    socket.emit("GETROOMS", {}, (response) => {
      if (response.success) {
        resolve(response.rooms);
      } else {
        reject(new Error("Failed to fetch rooms"));
      }
    });
  });
}

export async function createRoom(roomName, password) {
  return new Promise((resolve, reject) => {
    const userId = localStorage.getItem("userId");
    socket.emit("CREATEROOM", { userId, roomName, password }, (response) => {
      if (response.success) {
        resolve(response.roomId);
      } else {
        reject(new Error("Failed to create room"));
      }
    });
  });
}

export async function deleteUserAccount() {
  return new Promise((resolve, reject) => {
    const userId = localStorage.getItem("userId");
    socket.emit("DELETEUSER", { userId }, (response) => {
      if (response.success) {
        resolve();
      } else {
        reject(new Error("Failed to delete user account"));
      }
    });
  });
}
