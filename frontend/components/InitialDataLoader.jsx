"use client";
import React, { useEffect } from "react";
import { verifyLoginAsync } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { socket } from "../socket/socket";

const InitialDataLoader = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    dispatch(verifyLoginAsync());
    socket.emit("register", userId);

    return () => {
      socket.off("register");
    };
  }, []);

  return null;
};

export default InitialDataLoader;
