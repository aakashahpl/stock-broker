import React from "react";
import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

const schema = z.object({
  firstNumber: z.string(),
  secondNumber: z.string(),
});
type FormFields = z.infer<typeof schema>;

const TransactionInput = ({ currentStock }: any) => {
  const [transactionType, setTransactionType] = useState("buy");
  const [orderDetails, setOrderDetails] = useState({});
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<FormFields> = async (data: any) => {
    const URL = "http://localhost:3001/order/place-order";

    async function fetchData() {
      try {
        const side = transactionType === "buy" ? "bid" : "ask";
        const orderData = {
          side: side,
          price: Number(data.secondNumber),
          quantity: Number(data.firstNumber),
          ticker: "AAPL",
        };
        const response = await axios.post(URL, orderData, {
          withCredentials: true,
        });
        console.log(response.data);
        if (response.data) {
          toast({
            variant:"default",
            title: "Order Placed Successfully",
            description: "Check your order details in order section.",
            action: <Link href={`/user/order`} className=" border-[#8c8c8c] border-opacity-[0.6] border-[1px] px-2 py-1 rounded-md">Details</Link>
          });
        } else {
          toast({
            variant: "destructive",
            title: " Order failed",
            description: "Your order was not placed due to some error.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } catch (error) {
        console.error("Error placing order:", error);
      }
    }
    fetchData();
  };
  const changeTransactionType = (data: string) => {
    setTransactionType(data);
  };

  return (
    <div className=" flex flex-col h-3/5 w-2/12 border-[1px] border-myBorder rounded-md ml-10">
      <div className=" flex-[1.5] border-b-[1px] border-myBorder flex flex-col justify-center items-start px-2 ">
        <div className=" text-lg font-bold">{currentStock.name}</div>
        <div className=" text-sm font-semibold">$132.23</div>
      </div>

      <div className="flex-[1] border-b-[1px] border-myBorder px-2">
        <button
          className={`bg-myBg text-white h-full w-1/5 border-[#0abb92] font-semibold ${transactionType==="buy"?"text-[#0ba782] border-b-4 border-[#0abb92]":""}`}
          onClick={() => changeTransactionType("buy")}
        >
          BUY
        </button>
        <button
          className={` bg-myBg text-white h-full w-1/5 border-[#0abb92] font-semibold  ${transactionType==="sell"?"text-[#0ba782] border-b-4 border-[#0abb92]":""}`}
          onClick={() => changeTransactionType("sell")}
        >
          SELL
        </button>
      </div>

      <div className="flex-[6]  ">
        <div className=" flex flex-row justify-start items-center gap-2 px-2 h-[15%]">
          <button className=" focus:bg-[#10362d] focus:text-[#0ba782] font-semibold bg-myBg text-white text-xs rounded-full bg-[#252525] px-3 py-2 ">
            Delivery
          </button>
          <AlertDialog>
            <AlertDialogTrigger>
              <div className="focus:bg-[#10362d] focus:text-[#0ba782] font-semibold bg-myBg text-white text-xs rounded-full bg-[#252525] px-3 py-2">
                Intraday
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Intraday Coming Soon</AlertDialogTitle>
                <AlertDialogDescription>
                  This feature will be available soon.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                
                    Cancel
          
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className=" px-3 py-3 h-[85%] ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full "
          >
            <div className=" h-[75%] flex flex-col gap-3">
              <div className=" flex flex-row justify-between items-center ">
                <label htmlFor="firstNumber">Qty</label>
                <input
                  className="w-28 bg-[#10362d] text-right border-none focus:outline-none text-[#0ba782] font-semibold rounded-sm px-2"
                  type="number"
                  {...register("firstNumber")}
                />
                {errors.firstNumber && (
                  // <span>{errors.firstNumber.message}</span>  can be used to show errors for invalid input
                  <></>
                )}
              </div>
              <div className="  flex flex-row justify-between items-center">
                <label htmlFor="secondNumber">Price Limit</label>
                <input
                  className=" w-28 bg-[#10362d] text-right focus:outline-none text-[#0ba782] font-semibold rounded-sm px-2"
                  type="number"
                  {...register("secondNumber")}
                />
                {errors.secondNumber && <></>}
              </div>
              {/* <button type="submit">Buy</button> */}
            </div>
            <div className=" border-t-[1px] mx-2 border-myBorder flex justify-center items-center  h-[25%] ">
              {transactionType === "buy" ? (
                <Button variant={"myButton"} size={"st"} type="submit">
                  <div className=" font-semibold">BUY</div>
                </Button>
              ) : (
                <Button variant={"destructive"} size={"st"} type="submit">
                  <div className=" font-semibold">SELL</div>
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionInput;
