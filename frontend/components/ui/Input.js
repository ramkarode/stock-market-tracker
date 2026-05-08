"use client";

import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="
          text-sm
          font-medium
          text-gray-700
        "
      >
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required
        className="
          w-full
          px-4
          py-3
          rounded-xl
          border
          border-gray-300
          outline-none
          transition-all
          focus:ring-2
          focus:ring-orange-400
          focus:border-transparent
        "
      />
    </div>
  );
};

export default Input;