import { useSocket } from "../socket";

export function useWaitingRoomActions() {
  const socket = useSocket();

  const sendMessage = (roomId, message) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("CHAT", { roomId, message }, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error("Failed to send message"));
        }
      });
    });
  };

  const startGame = (roomId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("STARTGAME", { roomId }, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error("Failed to start game"));
        }
      });
    });
  };

  const kickMember = (roomId, targetId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("KICKMEMBER", { roomId, targetId }, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error("Failed to kick member"));
        }
      });
    });
  };

  const deleteRoom = (roomId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket is not connected"));
        return;
      }

      socket.emit("DELETEROOM", { roomId }, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error("Failed to delete room"));
        }
      });
    });
  };

  return { sendMessage, startGame, kickMember, deleteRoom };
}
