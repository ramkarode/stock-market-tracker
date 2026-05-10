const { Server } = require("socket.io");

let io;

// userId -> Set(socketIds)
const userSocketMap = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // restrict later
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }

      userSocketMap.get(userId).add(socket.id);

      console.log(`${userId} ->`, [...userSocketMap.get(userId)]);
    });

    // Example: send message
    socket.on("send_message", ({ toUserId, message }) => {
      const sockets = userSocketMap.get(toUserId);

      if (sockets) {
        sockets.forEach((s_id) => {
          io.to(s_id).emit("receive_message", { message });
        });
      }
    });

    // Disconnect cleanup
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);

      for (const [userId, sockets] of userSocketMap.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);

          if (sockets.size === 0) {
            userSocketMap.delete(userId);
          }

          break;
        }
      }
    });
  });
};

const getIO = () => io;

const emitToUser = (userId, event, data) => {
  const sockets = userSocketMap.get(userId);
  console.log(sockets, "sockets for user", userId);
  if (sockets) {
    sockets.forEach((s_id) => {
      io.to(s_id).emit(event, data);
    });
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
};
