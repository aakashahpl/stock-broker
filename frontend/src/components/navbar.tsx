import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiWallet } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useState, useRef } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useUser } from "../pages/context/userContext";
import axios from "axios";
import { RiH1 } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  // const [inputValue, setInputValue] = useState("");
  const [searchData, setSearchData] = useState(0);
  const inputValue = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const handleChange = (event: any) => {
    inputValue.current = event.target.value;
    // Manually update the input field's value
  };
  const { user } = useUser();
  // console.log(user);
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(inputValue.current); // Do whatever you want with the input value
    // Clear the input after submission if needed

    const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue.current}&apikey=demo`;

    try {
 
      const responseData = await axios.get(apiUrl);

      const bestMatches = responseData.data.bestMatches; //bestMatches will be an array. reduce takes array as input

      //filter the response which have region as United States
      const filteredObject = bestMatches.reduce((acc: any, curr: any) => {
        if (curr["4. region"] === "United States") {
          acc.push({
            symbol: curr["1. symbol"],
            name: curr["2. name"],
          });
        }
        return acc;
      }, []);

      // console.log(filteredObject);
      setSearchResults(filteredObject);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // setInputValue("");
  };

  return (
    <div className="flex flex-row text-white  justify-center items-center border-b-[1px] px-18 h-16 border-myBorder ">
      <div className="flex-[1.8] h-full  flex justify-center items-center overflow-hidden">
        <Image
          width={230}
          height={230}
          src="/nookLogo.png"
          alt=""
          priority={false}
        />
        <div>
          {user ? (
            <div className="gap-6 flex flex-row">
              <Link
                href={`/explore`}
                className=" text-neutral-100 font-semibold hover:cursor-pointer"
              >
                Explore
              </Link>
              <Link
                href={`/user/investments`}
                className=" text-neutral-100 font-semibold hover:cursor-pointer"
              >
                Investments
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className=" flex-[1.5]  h-full flex items-center justify-center  relative">
        <form
          onSubmit={handleSubmit}
          className="flex flex-row justify-center items-center gap-2 border-[1px] border-myBorder px-4 py-1 rounded-lg"
        >
          <IoSearchSharp size={20} />
          <input
            className=" text-white bg-myBackground border-myBorder  focus:border-transparent outline-none "
            type="text"
            // value={inputValue.current}
            onChange={handleChange}
            placeholder="Enter stock symbol"
          />
          {/* No explicit submit button, pressing Enter in the input field will trigger form submission */}
        </form>
        <div>
          {searchResults.length != 0 ? ( 
            <div className=" bg-orange-300 w-60 h-32 absolute right-40 top-16 flex flex-col">
              {searchResults.map((element, index) => (
                <Link
                  href={`/stock/${element.symbol}`}
                  className=" text-black flex flex-row justify-between w-full h-8 border-b-[1px] items-center"
                  key={index}
                >
                  <div className=" ml-4">{element.symbol}</div>
                  <div className=" mr-4">{element.name}</div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {user === null ? (
        <div className=" flex-1 ">
          <Button variant={"myButton"} type="submit">
            <div className=" font-bold text-md text-white ">Login/Register</div>
          </Button>
        </div>
      ) : (
        <div className=" flex-[1] flex flex-row justify-center items-center ">
          <div className=" px-4">
            <IoIosNotificationsOutline size={22} />
          </div>
          <div className=" px-4">
            <CiWallet size={22} />
          </div>
          <div className=" px-4">
            <BsCart size={22} />
          </div>
          <div className=" px-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CgProfile size={22} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
