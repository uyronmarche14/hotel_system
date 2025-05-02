"use client";
import React, { useState } from "react";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [confirmPass, setConfirmPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`The name you entered was: ${name}`);
  };

  return (
    <div className="w-full h-screen flex bg-white">
      <div className="w-1/2 h-full flex items-start mt-42 justify-center">
        <div className=" w-[536px] flex items-center justify-center p-8 m-8 rounded-lg">
          <div className="w-full flex flex-col items-center justify-center px-8">
            <div className="w-full flex flex-col items-start justify-start gap-2 pb-4">
              <h1 className="text-4xl text-black font-bold">Create Account</h1>
              <p className="font-light text-sm text-black">
                Already have an Account{" "}
                <a href="#" className="font-bold">
                  Login
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
                    className="w-full text-black p-2 rounded-md border border-black focus:outline-\1 focus:outline-amber-200"
                  />
                </label>
                <label className="w-full text-black">
                  Password:
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-black p-2 rounded-md border border-black focus:outline-1 focus:outline-amber-200"
                  />
                </label>
                <label className="w-full text-black">
                  Username:
                  <input
                    type="text"
                    value={pass}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-black p-2 rounded-md border border-black focus:outline-1 focus:outline-amber-200"
                  />
                </label>
                <label className="w-full text-black">
                  Username:
                  <input
                    type="text"
                    value={confirmPass}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-black p-2 rounded-md border border-black focus:outline-1 focus:outline-amber-200"
                  />
                </label>
                <input
                  type="submit"
                  value="Submit"
                  className="w-full text-white font-bold p-4 bg-[#1C3F32] rounded-md border border-[#1C3F32] hover:text-[#1C3F32] hover:bg-white cursor-pointer"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full bg-[#1C3F32]">
        <img
          src="https://res.cloudinary.com/ddnxfpziq/image/upload/v1745569291/Image_ux4eej.png"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
