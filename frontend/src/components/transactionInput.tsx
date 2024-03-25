import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";

const schema = z.object({
    firstNumber: z.number(),
    secondNumber: z.number(),
});

const TransactionInput = ({ currentStock }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    const [transactionType, setTransactionType] = useState("buy");
    const changeTransactionType = (data:string) => {
        setTransactionType(data);
    };

    return (
        <div className=" flex flex-col h-3/5 w-2/12 border-[1px] border-myBorder rounded-md ml-10">
            <div className=" flex-[1.5] border-b-[1px] border-myBorder flex flex-col justify-center items-start px-2 ">
                <div className=" text-lg">{currentStock.name}</div>
                <div className=" text-sm">132.23</div>
            </div>

            <div className="flex-[1] border-b-[1px] border-myBorder px-2">
                <button
                    className=" bg-myBg text-white h-full w-1/5 focus:border-b-4 focus:text-[#0ba782] border-[#0abb92] font-semibold"
                    onClick={() => changeTransactionType("buy")}
                >
                    BUY
                </button>
                <button
                    className=" bg-myBg text-white h-full w-1/5 focus:text-[#0ba782] focus:border-b-4 border-[#0abb92] font-semibold "
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
                                <AlertDialogTitle>
                                    Intraday Coming Soon
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This feature will be available soon.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    <Button variant={"myButton"} size={"xl"}>
                                        Cancel
                                    </Button>
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
                                    className="w-28 bg-[#10362d] text-right border-none focus:outline-none text-[#0ba782] font-semibold rounded-sm"
                                    type="number"
                                    
                                    {...register("firstNumber")}
                                />
                                {errors.firstNumber && (
                                    // <span>{errors.firstNumber.message}</span>  can be used to show errors for invalid input
                                    <></>
                                )}
                            </div>
                            <div className="  flex flex-row justify-between items-center">
                                <label htmlFor="secondNumber">
                                    Price Limit
                                </label>
                                <input
                                    inputMode="numeric"
                                    className=" w-28 bg-[#10362d] text-right focus:outline-none text-[#0ba782] font-semibold rounded-sm"
                                    type="number"
                                    {...register("secondNumber")}
                                />
                                {errors.secondNumber && <></>}
                            </div>
                        </div>
                        <div className=" border-t-[1px] mx-2 border-myBorder flex justify-center items-center  h-[25%] ">
                            {transactionType === "buy" ? (
                                <Button variant={"myButton"} size={"st"}>
                                    <div className=" font-semibold">BUY</div>
                                </Button>
                            ) : (
                                <Button variant={"destructive"} size={"st"}>
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
