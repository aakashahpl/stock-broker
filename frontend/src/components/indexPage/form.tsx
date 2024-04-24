import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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


interface ChildProps {
    onSubmit: (data: any) => Promise<void>;
  }
const LoginForm:React.FC<ChildProps> = ({onSubmit}) => {
  const formSchema = z.object({
    username: z.string().email({
      message: "Invalid email format.",
    }),
    password: z.string().min(2, {
      message: "Password must be at least 8 characters long.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}    
        className="space-y-1 flex flex-col w-2/3"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Your Email Address" {...field} />
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
                <Input type="password" placeholder="Your Password" {...field} />
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
          <div className=" font-bold text-md text-white ">Continue</div>
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;
