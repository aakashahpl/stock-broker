import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useRouter } from "next/router";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import Cookies from "universal-cookie";
import { CgProfile } from "react-icons/cg";
import LoginForm from "../components/indexPage/form";
import axios from "axios";
import cors from "cors";
import { useRef } from "react";
// import z from "zod";
import { useUser } from "../context/userContext";
import { redirect } from "next/dist/server/api-utils";
import jwt from "jsonwebtoken";
import Navbar from "../components/navbar";


interface Payload {
  user: {
    username: string;
    _id: string;
  };
}

const Hero = () => {
  const pageRef = useRef(null);
  const cookies = new Cookies();
  const { loginUser, user } = useUser();
  const [signUp, setSignUp] = useState(false);
  const router = useRouter();
  if (cookies.get("authorization")) {
    const token = cookies.get("authorization");
    console.log(token);
    const payload = jwt.decode(token) as Payload; // type assertion
    if (payload) {
      loginUser(payload.user);
    }
    router.push("/explore");
  }
  const handleFormData = async (data: any) => {
    console.log(data);
    const userLogin = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_Backend_URL}/user/login`,
          data
        );
        cookies.set("authorization", response.data.accessToken, { path: "/" });
        console.log(cookies.get("authorization"));
        await loginUser(data);
        router.push("/explore");
      } catch (error: any) {
        console.log(error.message);
      }
    };
    userLogin();
  };

  const handleGuestLogin = async () => {
    const data = {
      username: "robin@gmail.com",
      password: "robin",
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/user/login`,
        data,
        { withCredentials: true } // ✅ Ensures the cookie is stored in the browser
      );

      console.log("Login successful:", response.data);
      
      await loginUser(data); // Keep this if it's needed for local state updates
      router.push("/explore");
    } catch (error: any) {
      console.log("Login error:", error.message);
    }
  };

  const handleSignUp = () => {
    window.scrollTo(0, 0);
    setSignUp(true);
  };

  return (
    <div>
      <div className="w-full h-screen flex justify-center sticky top-0 overflow-hidden bg-[url('https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/images/intro-background@1x__d80cfee2ff3621c010d506de30f360c57c94eece7bcdedd008b73463335ada71.png')] bg-cover bg-center">
        <div className="absolute lg:w-2/6 mt-40 flex flex-col justify-center items-center gap-5">
          <div className="text-center opacity-80">
            <p className="font-medium pb-3 text-4xl lg:text-7xl">
              All things finance,
              <br />
              right here.
            </p>
            <p className="text-xl pb-4 text-wrap py-2 font-md">
              Online platform to invest in stocks.
            </p>
          </div>
          <Button
            onClick={handleSignUp}
            className=" rounded-full"
            variant={"default"}
            size={"lg"}
          >
            Login / Sign Up
          </Button>
        </div>

        <div>
          {signUp == true ? (
            <div className=" h-screen w-full bg-slate-600 bg-opacity-70 absolute top-0 left-0 flex justify-center items-center ">
              <div className=" flex flex-row absolute h-3/5 w-2/4 rounded-md overflow-hidden ">
                <div className=" bg-[#77c1ad] h-full w-1/2 ">
                  <Image
                    className=" overflow-hidden mx-w-screen h-full"
                    width={500}
                    height={500}
                    src="/signUpBg.jpg"
                    alt=""
                    style={{ opacity: 0.4 }}
                  />
                  <div className="absolute text-4xl font-bold w-1/3 top-16 left-10 text-white ">
                    Simple, Free Investing
                  </div>
                  <div className=" h-3 bg-white absolute w-7 bottom-10 left-10 animate-width-cycle"></div>
                </div>
                <div className=" bg-white h-full w-1/2 flex flex-col justify-center items-center">
                  <div
                    className="absolute text-black right-5 hover:cursor-pointer top-3 rounded-full hover:bg-slate-200 p-1 "
                    onClick={() => setSignUp(false)}
                  >
                    <RxCross2 size={20} />
                  </div>
                  <div className=" flex-1 flex flex-col justify-center gap-10  items-center">
                    <div className=" font-bold text-4xl text-slate-700 ">
                      Welcome to Zenith
                    </div>
                    <div>
                      <button className="border-gray-400 border px-10 py-2 rounded-md" onClick={handleGuestLogin}>
                        <div className="flex flex-row gap-2 justify-center items-center">
                          <CgProfile size={30} />
                          <div className=" font-semibold text-slate-700 text-base ">
                            Guest Login
                          </div>
                        </div>{" "}
                      </button>
                    </div>
                  </div>
                  <div className="flex-[0.1] flex flex-row items-center w-5/6">
                    <div className="border h-[1px] w-full border-neutral-300"></div>
                    <p className="mx-2">Or</p>
                    <div className="border h-[1px] w-full border-neutral-300"></div>
                  </div>
                  <div className=" flex-1 w-full flex justify-center items-start mt-10">
                    <LoginForm onSubmit={handleFormData} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className=" flex flex-col items-center justify-center h-screen bg-[white] sticky top-0">
        <div
          className=" h-11/12 w-full  max-lg:px-5 flex flex-col justify-start items-center relative gap-4"
          ref={pageRef}
        >
          <h3 className="  font-bold text-5xl lg:text-6xl text-center">
            Join a new generation of <br />Investors
          </h3>
          <Button variant={"myButton"} onClick={handleSignUp} size={"lg"}>
            <div className=" font-bold text-md text-white ">Get Started</div>
          </Button>
          <div>
            <img
              className=" lg:h-96 "
              src="https://zerodha.com/static/images/landing.png"
              alt=""
            />
          </div>
        </div>

      </div>
      <div className=" bg-[#c8f43c] px-10 flex flex-col lg:flex-row h-[100vh] relative border border-amber-500">
        <div className=" flex justify-center items-center flex-[1.2]">
          <img
            className=""
            src="https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/images/product_hero_invest__91b9077cf4788b508a013b9dda8c3ffe4d4fff969655c212a0201c9533237d46.png"
            alt=""
            draggable="false"
          />
        </div>
        <div className=" flex-1 flex flex-col  gap-2 items-start justify-center ">
          <div className=" mb-10">
            <h3 className=" text-4xl lg:text-5xl w-60 text-[#3bb84b]">Investing</h3>
            <h3 className=" text-4xl lg:text-5xl lg:w-96 ">
              Build your portfolio starting with just $1
            </h3>
          </div>
          <h3 className=" text-lg lg:w-96">
            Invest in stocks, options, and ETFs at your pace and
            commission-free.
          </h3>
          <h3>Investing Disclosures</h3>
        </div>
      </div>
    </div>
  );
};

export default Hero;
