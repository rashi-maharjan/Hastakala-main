import React, { useState } from "react";
import logo from "../assets/images/logo.png";

function Sign_up() {
  const [fullname, setFullname] = useState()
  const [email, setEmail] = useState()
  const [role, setRole] = useState()
  const [password, setPassword] = useState()

  return (
    <section
      className="backdrop-blur-3xl h-screen overflow-hidden flex justify-center py-20 relative before:absolute before:left-[50%] before:top-[20%] 2xl:before:top-[30%]
     before:bg-primary/80 before:rounded-full before:size-[15%] 2xl:before:size-[15%] before:-z-[1] before:blur-[105px] after:absolute after:right-[%] after:top-[70%] 2xl:after:top-[60%] after:bg-red-600 after:rounded-full after:size-[15%] 2xl:after:size-[15%] after:-z-[1] after:blur-[105px]"
    >
      <div className="container flex justify-center items-center z-[10] relative before:absolute before:right-[55%] before:top-[30%] 2xl:before:top-[35%] before:bg-green-500 before:rounded-full before:size-[15%] 2xl:before:size-[15%] before:-z-[1] before:blur-[105px]">
        <div className="place-self-center">
          <img
            src={logo}
            alt="Hastakala Logo"
            width={158}
            height={38}
            loading="lazy"
            className="place-self-center mb-12 -z-[2]"
          />
          <div className="relative bg-white/20 max-sm:w-[300px] w-[470px] px-9 py-12 border-2 border-white rounded-xl">
            <div>
              <label htmlFor="Fullname" className="font-inter text-base">
                Full Name
              </label>
              <br />
              <input
                className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                type="text"
                id="text"
              />
            </div>
            <div className="mt-6">
              <label htmlFor="Email" className="font-inter text-base">
                Email
              </label>
              <br />
              <input
                className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                type="email"
                id="Email"
              />
            </div>
            <div className="mt-6">
              <label htmlFor="password" className="font-inter text-base">
                Password
              </label>
              <br />
              <input
                className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                type="password"
                id="password"
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="confirm_password"
                className="font-inter text-base"
              >
                Confirm Password
              </label>
              <br />
              <input
                className="w-full border border-black rounded-3xl py-2 px-5 mt-4 outline-none"
                type="confirm_password"
                id="confirm_password"
              />
            </div>

            <div className="mt-14 place-self-center text-center">
              <a
                href="#"
                className="bg-primary/90 px-5 py-3 w-64 mb-4 block text-center text-white rounded-3xl hover:bg-primary transition-all duration-200 ease-in-out"
              >
                Sign Up
              </a>
              <span>
                Don't have account access?{" "}
                <a
                  href="#"
                  className="text-primary whitespace-nowrap hover:underline"
                >
                  Sign In
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sign_up;
