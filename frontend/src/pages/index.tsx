import React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useRouter } from "next/router";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useUser } from "./context/userContext";
import { redirect } from "next/dist/server/api-utils";

const Hero = () => {
    const { loginUser, user } = useUser();
    const [signUp, setSignUp] = useState(false);

    const router = useRouter();

    const formSchema = z.object({
        email: z.string().email({
            message: "Invalid email format.",
        }),
        password: z.string().min(2, {
            message: "Password must be at least 8 characters long.",
        }),
    });

    const handleSignUp = () => {
        setSignUp(true);
    };

    const handleFormData = async (data: any) => {
        console.log(data);
        await loginUser(data);
        router.push("/explore");
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div>
            <div className=" flex flex-col items-center justify-center h-screen relative">
                <Button variant={"myButton"} onClick={handleSignUp} size={"lg"}>
                    <div className=" font-bold text-md text-white ">
                        Get Started
                    </div>
                </Button>
                <div>
                    {signUp == true ? (
                        <div className=" h-screen w-full bg-slate-500 bg-opacity-10 absolute top-0 left-0 flex justify-center ">
                            <div className=" flex flex-row absolute h-3/5 w-2/4 top-40 rounded-md overflow-hidden ">
                                <div className=" bg-[#77c1ad] h-full w-1/2 ">
                                    <Image
                                        className=" overflow-hidden w-full h-full"
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
                                            Welcome to Nook
                                        </div>
                                        <div>
                                            <Button
                                                variant={"outline"}
                                                size={"xl"}
                                            >
                                                <div className="flex flex-row gap-2 justify-center items-center">
                                                    <FcGoogle size={30} />
                                                    <div className=" font-semibold text-slate-700 text-base ">
                                                        Continue with Google
                                                    </div>
                                                </div>{" "}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex-[0.1]">Or</div>
                                    <div className=" flex-1 w-full flex justify-center items-start mt-10">
                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(
                                                    handleFormData
                                                )}
                                                className="space-y-1 flex flex-col w-2/3"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Your Email Address"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="password"
                                                                    placeholder="Your Password"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    style={{
                                                        marginTop: "2rem",
                                                    }}
                                                    variant={"myButton"}
                                                    type="submit"
                                                >
                                                    <div className=" font-bold text-md text-white ">
                                                        Continue
                                                    </div>
                                                </Button>
                                            </form>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Hero;
