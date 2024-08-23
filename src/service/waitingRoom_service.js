import socket from "./socket";

export function sendMessage(roomId, message) {
  return new Promise((resolve, reject) => {
    socket.emit("CHAT", { roomId, message }, (response) => {
      if (response.success) {
        resolve();
      } else {
        reject(new Error("Failed to send message"));
      }
    });
  });
}

export function startGame(roomId) {
  return new Promise((resolve, reject) => {
    socket.emit("STARTGAME", { roomId }, (response) => {
      if (response.success) {
        resolve();
      } else {
        reject(new Error("Failed to start game"));
      }
    });
  });
}

export function kickMember(roomId, targetId) {
  return new Promise((resolve, reject) => {
    socket.emit("KICKMEMBER", { roomId, targetId }, (response) => {
      if (response.success) {
        resolve();
      } else {
        reject(new Error("Failed to kick member"));
      }
    });
  });
}

export function deleteRoom(roomId) {
  return new Promise((resolve, reject) => {
    socket.emit("DELETEROOM", { roomId }, (response) => {
      if (response.success) {
        resolve();
      } else {
        reject(new Error("Failed to delete room"));
      }
    });
  });
}
