import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiWallet } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useState, useRef } from "react";
import axios from "axios";
import { RiH1 } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
    // const [inputValue, setInputValue] = useState("");
    const [searchData, setSearchData] = useState(0);
    const inputValue = useRef("");
    const [searchResults, setSearchResults] = useState([]);
    const handleChange = (event: any) => {
        inputValue.current = event.target.value;
        // Manually update the input field's value
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        console.log(inputValue.current); // Do whatever you want with the input value
        // Clear the input after submission if needed

        const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue.current}&apikey=demo`;

        try {
            // Make a GET request using async/await
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
            // Handle error
            console.error("Error fetching data:", error);
        }

        // setInputValue("");
    };

    return (
        <div className="flex flex-row text-white  justify-center items-center border-b-[1px] px-20 h-16">
      <div className="flex-[1.8] h-full  flex justify-center items-center overflow-hidden">
        <Image width={230} height={230} src="/nookLogo.png" alt="" />
    </div>
            <div className=" flex-[1.5]  h-full flex items-center justify-center  relative">
                <form onSubmit={handleSubmit}>
                    <input
                        className=" text-black border-"
                        type="text"
                        // value={inputValue.current}
                        onChange={handleChange}
                        placeholder="Enter something..."
                    />
                    {/* No explicit submit button, pressing Enter in the input field will trigger form submission */}
                </form>
                <div>
                    {searchResults.length != 0 ? (
                        <div className=" bg-orange-300 w-60 h-32 absolute right-24 top-20 flex flex-col">
                            {searchResults.map((element, index) => (
                                <Link
                                    href={`/stock/${element.symbol}`}
                                    className=" text-black flex flex-row justify-between w-full h-8 border-b-[1px] items-center"
                                    key={index}
                                >
                                    <div className=" ml-4">
                                        {element.symbol}
                                    </div>
                                    <div className=" mr-4">{element.name}</div>
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
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
                    <CgProfile size={22} />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
