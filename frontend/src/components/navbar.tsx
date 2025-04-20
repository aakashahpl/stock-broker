import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiWallet } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useState, useRef } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useUser } from "../context/userContext";
import { useDeviceContext } from '../context/DeviceContext';
import axios from "axios";
import { RiH1 } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import Search from "./Search";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const { isMobile } = useDeviceContext();
  const { logoutUser } = useUser();
  const cookies = new Cookies();
  const [searchData, setSearchData] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const inputValue = useRef("");
  const router = useRouter();
  const { user } = useUser();

  const handleChange = (event: any) => {
    inputValue.current = event.target.value;
    // Manually update the input field's value
  };
  // const handleSubmit = async (event: any) => {
  //   event.preventDefault();
  //   console.log(inputValue.current);
  //   // Clear the input after submission if needed

  //   const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue.current}&apikey=demo`;

  //   try {
  //     const responseData = await axios.get(apiUrl);

  //     const bestMatches = responseData.data.bestMatches; //bestMatches will be an array. reduce takes array as input

  //     //filter the response which have region as United States
  //     const filteredObject = bestMatches.reduce((acc: any, curr: any) => {
  //       if (curr["4. region"] === "United States") {
  //         acc.push({
  //           symbol: curr["1. symbol"],
  //           name: curr["2. name"],
  //         });
  //       }
  //       return acc;
  //     }, []);

  //     // console.log(filteredObject);
  //     setSearchResults(filteredObject);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  //   // setInputValue("");
  // };

  const handleLogout = () => {
    localStorage.removeItem("user");
    logoutUser();
    router.push("/");
    cookies.remove("authorization", { path: "/" });
  };

  return (
    <div className={`flex flex-row text-stone-200 justify-between items-center gap-2 md:px-24 h-20 bg-transparent absolute top-0 z-[1000] w-full ${user !== null ? 'border-[#2b2b2b] border-b-[1px]' : ''}`}
    >
      <div className="flex-[1.8] h-full flex justify-center items-center overflow-hidden">
        <div className="flex flex-row items-center px-5">
          {user ? (
            <Image
              src="/zenith-logo2.svg"  
              width={isMobile?50:60}
              height={isMobile?50:60}
              alt="Zenith Logo"
              className="px-2"
            />
          ) : (
            <Image
              src="/zenith-logo.svg"  
              width={isMobile?50:60}
              height={isMobile?50:60}
              alt="Zenith Logo"
              className="px-2"
            />
          )}
          <div className={`uppercase font-semibold text-[1.5rem] text-[#31373d] ${user == null ? 'text-neutral-800' : 'text-neutral-200'}`}>Zenith</div>
        </div>
        <div>
          {user ? (
            <div className="gap-6 flex flex-row pl-4">
              <Link
                href={`/explore`}
                className={`font-semibold hover:cursor-pointer ${window.location.pathname === "/explore"
                  ? "text-[#0ba782]"
                  : "text-neutral-100"
                  }`}
              >
                Explore
              </Link>

              <Link
                href={`/user/investments`}
                className={` font-semibold hover:cursor-pointer ${window.location.pathname == "/user/investments"
                  ? "text-[#0ba782]"
                  : "text-neutral-100"
                  }`}
              >
                Investments
              </Link>
              <Link
                href={`/news`}
                className={`font-semibold hover:cursor-pointer ${window.location.pathname == "/news"
                  ? "text-[#0ba782]"
                  : "text-neutral-100"
                  }`}
              >
                News
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className=" flex-[1.5]  h-full flex items-center justify-center relative">
        <Search />


      </div>
      {user === null ? (

        !isMobile && <div className="flex-1"></div>


      ) : (
      <div className=" flex-[1] flex flex-row justify-center items-center ">
        <div className=" px-4">
          <IoIosNotificationsOutline size={26} />
        </div>
        <Link href="/user/order" className=" px-4">
          <BsCart size={25} />
        </Link>
        <div className=" px-4">
          <CiWallet size={25} />
        </div>
        <div className=" px-4">
          <ProfileDropdown handleLogout={handleLogout} />
        </div>
      </div>
      )}
    </div>
  );
}

export default Navbar;
