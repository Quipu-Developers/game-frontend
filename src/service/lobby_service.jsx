import { useCallback } from "react";
import { useSocket } from "../socket";

export function useLobbyActions() {
  const socket = useSocket();

  const fetchRooms = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem("userId");
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
  }, [socket]);

  const createRoom = useCallback(
    async (roomName) => {
      return new Promise((resolve, reject) => {
        const userId = localStorage.getItem("userId");
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("CREATEROOM", { userId, roomName }, (response) => {
          console.log(response);
          if (response.roomId) {
            resolve(response.roomId);
          } else {
            reject(new Error("Failed to create room"));
          }
        });
      });
    },
    [socket]
  );

  const deleteUserAccount = useCallback(
    async (roomId) => {
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
    },
    [socket]
  );

  return { fetchRooms, createRoom, deleteUserAccount };
}
