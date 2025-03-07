import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
// const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import Cookies from "universal-cookie";

export default function Home() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_URL}/user/order`, {
          withCredentials: true,
        });
        console.log(response.data.orders);
        setOrders(response.data.orders.reverse());
        if (!response) {
          console.log("no response");
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
        throw error;
      }
    }

    fetchData();

    // return () => {
    // Cleanup code goes here
    // };
  }, []);

  return (
    <>
      <main
        className={`flex min-h-screen flex-row justify-between  mx-96 mt-24`}
      >
        <div className=" w-8/12 flex flex-col justify-start gap-5">
          <div className=" font-bold text-slate-100 pb-3 text-xl ">Orders</div>
          <div className="flex flex-col w-full h-auto  justify-center  rounded-lg overflow-hidden  ">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col justify-start w-full text-white px-3 h-auto  border-myBorder border-dashed "
              >
                <div className="flex flex-row justify-start items-start py-2">
                  <h3 className=" text-sm">
                    {new Date(order.date).toLocaleDateString("en-US", { 
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                </div>
                <div className="flex flex-row justify-between w-full text-white px-3 pb-10 pt-2  items-center border-t  border-myBorder border-dashed">
                  <div>
                    <h3 className=" text-lg min-w-40">{order.stockName}</h3>
                    <div className=" flex flex-row gap-1 text-sm font-semibold ">
                      <h3>{order.type}</h3>
                      <h3>.regular.</h3>
                      <h3>limit</h3>
                    </div>
                  </div>
                  <div>
                    <h3 className=" text-sm">Qty</h3>
                    <h3 className=" text-sm">{order["quantity"]}</h3>
                  </div>
                  <div>
                    <h3 className=" text-sm">Price</h3>
                    <h3 className=" text-sm">{order["price"]}&nbsp;$</h3>
                  </div>
                  <div>
                    <h3 className=" text-sm">{order["stock"]}</h3>
                    <h3 className=" text-sm pt-6">
                      {order.status === "pending" ? (
                        <h3 className=" text-red-400">pending</h3>
                      ) : (
                        <h3 className=" text-green-400">complete</h3>
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
