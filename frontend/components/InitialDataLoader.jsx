"use client";
import React, { useEffect } from "react";
import { verifyLoginAsync } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { socket } from "../socket/socket";

const InitialDataLoader = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    dispatch(verifyLoginAsync());
    socket.emit("register", userId);
    socket.on("alert-triggered", (data) => {
      toast.alert("An alert was triggered!");
      // setAlerts((prev) =>
      //   prev.map((alertItem) => {
      //     if (alertItem._id === data.data.alertId) {
      //       return {
      //         ...alertItem,
      //         isTriggered: true,
      //         currentPrice: data.data.currentPrice,
      //         triggeredAt: data.data.triggeredAt,
      //       };
      //     } else {
      //       return alertItem;
      //     }
      //   }),
      // );
    });
    return () => {
      socket.off("register");
      socket.off("alert-triggered");
    };
  }, []);

  return null;
};

export default InitialDataLoader;
