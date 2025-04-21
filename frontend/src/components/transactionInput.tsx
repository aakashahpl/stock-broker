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
import StockDetails from "./explore/stock";

const TransactionInput = ({ currentStock }: any) => {
  const [transactionType, setTransactionType] = useState("buy");
  const [isFractional, setIsFractional] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Update schema based on the fractional mode
  const schema = z.object({
    firstNumber: isFractional 
      ? z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
          message: "Please enter a valid number greater than 0",
        })
      : z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
          message: "Please enter a valid whole number greater than 0",
        }),
    secondNumber: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Please enter a valid price greater than 0",
    }),
  });
  
  type FormFields = z.infer<typeof schema>;
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstNumber: "1",
      secondNumber: currentStock?.price?.toString() || "0",
    }
  });
  
  const watchedValues = watch();
  
  // Calculate the price when quantity or price changes
  useEffect(() => {
    if (isFractional && watchedValues.firstNumber && watchedValues.secondNumber) {
      const qty = parseFloat(watchedValues.firstNumber);
      const price = parseFloat(watchedValues.secondNumber);
      
      if (!isNaN(qty) && !isNaN(price)) {
        const total = qty * price;
        setCalculatedPrice(total);
      } else {
        setCalculatedPrice(null);
      }
    } else {
      setCalculatedPrice(null);
    }
  }, [watchedValues.firstNumber, watchedValues.secondNumber, isFractional]);
  
  const onSubmit: SubmitHandler<FormFields> = async (data: any) => {
    const URL = `${process.env.NEXT_PUBLIC_Backend_URL}/order/place-order`;

    try {
      const side = transactionType === "buy" ? "bid" : "ask";
      const quantity = isFractional ? parseFloat(data.firstNumber) : parseInt(data.firstNumber);
      
      const orderData = {
        side: side,
        price: Number(data.secondNumber),
        quantity: quantity,
        ticker: currentStock["ticker"],
        isFractional: isFractional,
      };
      
      const response = await axios.post(URL, orderData, {
        withCredentials: true,
      });
      
      console.log("order response over here", response.data);
      
      if (response.data) {
        toast({
          variant: "default",
          title: "Order Placed Successfully",
          description: "Check your order details in order section.",
          action: <Link href={`/user/order`} className="border-[#8c8c8c] border-opacity-[0.6] border-[1px] px-2 py-1 rounded-md">Details</Link>
        });
      } else {
        toast({
          variant: "destructive",
          title: "Order failed",
          description: "Your order was not placed due to some error.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Order failed",
        description: "An error occurred while placing your order.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };
  
  const changeTransactionType = (data: string) => {
    setTransactionType(data);
  };
  
  const toggleFractional = (isEnabled: boolean) => {
    setIsFractional(isEnabled);
    // Reset the form fields when switching modes
    if (isEnabled) {
      setValue("firstNumber", "0.1");
    } else {
      setValue("firstNumber", "1");
    }
  };

  return (
    <div className="flex flex-col h-3/5 w-2/12 border-[1px] border-myBorder rounded-md ml-10">
      <div className="flex-[1.5] border-b-[1px] border-myBorder flex flex-col justify-center items-start px-2">
        <div className="text-lg font-bold">{currentStock?.name}</div>
        <div className="text-sm font-semibold">${currentStock?.price || "132.23"}</div>
      </div>

      <div className="flex-[1] border-b-[1px] border-myBorder px-2">
        <button
          className={`bg-myBg text-white h-full w-1/5 border-[#0abb92] font-semibold ${transactionType === "buy" ? "text-[#0ba782] border-b-4 border-[#0abb92]" : ""}`}
          onClick={() => changeTransactionType("buy")}
        >
          BUY
        </button>
        <button
          className={`bg-myBg text-white h-full w-1/5 border-[#0abb92] font-semibold ${transactionType === "sell" ? "text-[#0ba782] border-b-4 border-[#0abb92]" : ""}`}
          onClick={() => changeTransactionType("sell")}
        >
          SELL
        </button>
      </div>

      <div className="flex-[6]">
        <div className="flex flex-row justify-start items-center gap-2 px-2 h-[15%]">
          <button 
            className={`font-semibold text-white text-xs rounded-full px-3 py-2 ${!isFractional ? "bg-[#10362d] text-[#0ba782]" : "bg-[#252525]"}`}
            onClick={() => toggleFractional(false)}
          >
            Delivery
          </button>
          <button 
            className={`font-semibold text-white text-xs rounded-full px-3 py-2 ${isFractional ? "bg-[#10362d] text-[#0ba782]" : "bg-[#252525]"}`}
            onClick={() => toggleFractional(true)}
          >
            Fractional
          </button>
        </div>
        <div className="px-3 py-3 h-[85%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <div className="h-[75%] flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <label htmlFor="firstNumber">Qty</label>
                <input
                  className="w-28 bg-[#10362d] text-right border-none focus:outline-none text-[#0ba782] font-semibold rounded-sm px-2"
                  type="number"
                  step={isFractional ? "0.01" : "1"}
                  min={isFractional ? "0.01" : "1"}
                  {...register("firstNumber")}
                />
                {errors.firstNumber && (
                  <span className="text-xs text-red-500">{errors.firstNumber.message}</span>
                )}
              </div>
              <div className="flex flex-row justify-between items-center">
                <label htmlFor="secondNumber">Price Limit</label>
                <input
                  className="w-28 bg-[#10362d] text-right focus:outline-none text-[#0ba782] font-semibold rounded-sm px-2"
                  type="number"
                  step="0.01"
                  {...register("secondNumber")}
                />
                {errors.secondNumber && (
                  <span className="text-xs text-red-500">{errors.secondNumber.message}</span>
                )}
              </div>
              
              {isFractional && calculatedPrice !== null && (
                <div className="flex flex-row justify-between items-center">
                  <label>Total</label>
                  <span className="text-[#0ba782] font-semibold">${calculatedPrice.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t-[1px] mx-2 border-myBorder flex justify-center items-center h-[25%]">
              {transactionType === "buy" ? (
                <Button variant={"myButton"} size={"st"} type="submit">
                  <div className="font-semibold">BUY</div>
                </Button>
              ) : (
                <Button variant={"destructive"} size={"st"} type="submit">
                  <div className="font-semibold">SELL</div>
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