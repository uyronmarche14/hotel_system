"use client";
import React, { useState } from "react";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [confirmPass, setConfirmPassword] = useState("");
  const [selected, isSelected] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`The name you entered was: ${name}`);
  };

  const filledSelected = () => {};

  return (
    <div className="w-full h-screen flex bg-white">
      <div className="w-1/2 h-full flex items-center justify-center ">
        <div className="w-[536px] flex items-center justify-center  m-8 rounded-lg">
          <div className="w-full flex flex-col items-center justify-center ">
            <div className="w-full flex flex-col items-start justify-start gap-2 pb-4">
              <h1 className="text-4xl text-black font-bold">Login Now </h1>
              <p className="font-light text-sm text-black">
                Sign in to your{" "}
                <a href="#" className="font-bold">
                  Account
                </a>
              </p>
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center">
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center justify-center gap-4"
              >
                <label className="w-full text-black">
                  Username:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-black p-2 rounded-md border-1 border-gray-200 focus:outline-\1 focus:outline-amber-200"
                  />
                </label>

                <label className="w-full text-black">
                  Password:
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-black p-2 rounded-md border-1 border-gray-200 focus:outline-1 focus:outline-amber-200"
                  />
                </label>

                <div className="w-full flex flex-row space-x-2 items-start justify-start">
                  <input className="p-2 h-4 w-4 border-1 border-black" />
                  <p className="text-black ">Remember Me</p>
                </div>

                <input
                  type="submit"
                  value="Create Account"
                  className="w-full mt-2 text-white font-bold p-4 bg-[#1C3F32] rounded-md border border-[#1C3F32] hover:text-[#1C3F32] hover:bg-white cursor-pointer"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex bg-[#1C3F32]">
        <img
          src="https://res.cloudinary.com/ddnxfpziq/image/upload/v1745569291/Image_ux4eej.png"
          className="w-full h-full object-cover"
          alt="Login page illustration"
        />
      </div>
    </div>
  );
};

export default Login;
