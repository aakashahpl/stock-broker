import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiWallet } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

function Navbar() {
    return (
        <div className="flex flex-row text-white h-20 justify-center items-center border-b-[1px] border-myBorder px-80">
            <div className="flex-[1.8]">Part</div>
            <div className=" flex-[1.5]  h-full flex items-center justify-center">

                <input type="text" className=" w-96"/>
            </div>
            <div className=" flex-[1] flex flex-row justify-center items-center ">
                <div className=" px-4"><IoIosNotificationsOutline size={22} /></div>
                <div className=" px-4"><CiWallet size={22} /></div>
                <div className=" px-4"><BsCart size={22} /></div>
                <div className=" px-4"><CgProfile size={22} /></div>
            </div>
        </div>
    );
}

export default Navbar;
