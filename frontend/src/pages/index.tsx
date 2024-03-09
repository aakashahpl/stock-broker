import React from "react";
import Navbar from "./navbar";
import { useState } from "react";
const Hero = () => {
    const [signUp, setSignUp] = useState(false);
    const handleSignUp = ()=>{
      setSignUp(true);
    }
    return (
        <div>
            <Navbar />
            <div className=" flex flex-col items-center justify-center h-screen relative">
                <button className=" bg-blue-400 w-28 h-8 font-bold text-white rounded-sm hover:cursor-pointer" onClick={handleSignUp}>
                    SignUp
                </button>
                <div>
                    {signUp==true? (
                        <div className=" h-screen w-full bg-slate-500 bg-opacity-10 absolute top-0 left-0 flex justify-center ">
                            <div className=" flex flex-row absolute h-2/4 w-2/4 top-40 rounded-lg">
                              <div className=" bg-cyan-400 h-full w-1/2"></div>
                              <div className=" bg-white h-full w-1/2">
                                <div className="absolute text-black right-5 hover:cursor-pointer top-3" onClick={()=>setSignUp(false)} >X</div>
                              </div>
                            </div>
                        </div>
                    ) : (
                        null
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;
