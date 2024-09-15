import { useCallback } from "react";
import { useSocket } from "../socket";

export function useWaitingRoomActions() {
  const { socket, storage } = useSocket();

  const startGame = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("STARTGAME", {}, (response) => {
        if (response.success) {
          resolve(response.gameInfo);
        } else {
          reject(new Error("Failed to start game"));
        }
      });
    });
  }, [socket, storage]);

  const kickMember = useCallback(
    (targetId) => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("KICKMEMBER", { targetId }, (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error("Failed to kick member"));
          }
        });
      });
    },
    [socket, storage]
  );

  const deleteRoom = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("DELETEROOM", {}, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error("Failed to delete room"));
        }
      });
    });
  }, [socket, storage]);

  const leaveRoom = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("LEAVEROOM", {}, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error("Failed to leave room"));
        }
      });
    });
  }, [socket, storage]);

  return { startGame, kickMember, deleteRoom, leaveRoom };
}
