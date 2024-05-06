import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "universal-cookie";
// import { useUser } from "./pages/context/userContext";

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
    // const { loginUser } = useUser();
    const cookies = new Cookies();
    const user = req.cookies.get("authorization");
    console.log("user", user);
    if (!user) {
        return NextResponse.redirect(new URL("/", req.url));
    }else{
        // loginUser(user);
    }

}
// return NextResponse.redirect(new URL("/home", req.url));
// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/explore","/stock/:slug*","/investments"],
};
