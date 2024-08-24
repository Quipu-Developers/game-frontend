import { useSocket } from "../socket";

export function useLobbyActions() {
  const socket = useSocket();

  const fetchRooms = async () => {
    return new Promise((resolve, reject) => {
      // const userId = localStorage.getItem("userId");
      const userId = 1;
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("GETROOMS", { userId }, (response) => {
        if (response.success) {
          resolve(response.rooms);
        } else {
          reject(new Error("Failed to fetch rooms"));
        }
      });
    });
  };

  const createRoom = async (roomName) => {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem("userId");
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("CREATEROOM", { userId, roomName }, (response) => {
        if (response.success) {
          resolve(response.roomId);
        } else {
          reject(new Error("Failed to create room"));
        }
      });
    });
  };

  const deleteUserAccount = async (roomId) => {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem("userId");
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("DELETEUSER", { roomId, userId }, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error("Failed to delete user account"));
        }
      });
    });
  };

  return { fetchRooms, createRoom, deleteUserAccount };
}
