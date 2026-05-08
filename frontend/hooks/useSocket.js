// Starter file
"use client";

import { useEffect } from "react";
import { socket } from "../socket/socket";

const useSocket = (userId) => {
  useEffect(() => {
    if (!userId) return;

    // Connect socket
    socket.connect();

    // Send user info
    socket.emit("join", {
      userId,
    });

    // Connected
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");

      socket.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useSocket;