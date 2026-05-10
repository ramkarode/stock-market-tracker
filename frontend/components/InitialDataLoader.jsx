"use client";
import React, { useEffect } from "react";
import { verifyLoginAsync } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const InitialDataLoader = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyLoginAsync());
  }, []);

  return null;
};

export default InitialDataLoader;
