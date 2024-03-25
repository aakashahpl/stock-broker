import express from "express";
import user from "../model/user";
import passport from "passport";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import userModel from "../model/user";

const Router = express.Router();

Router.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        await user.register({ username: req.body.username }, req.body.password);
        passport.authenticate("local")(req, res, () => {
            //secret cannot be undefined
            if (!process.env.ACCESS_TOKEN_SECRET) {
                throw new Error(
                    "ACCESS_TOKEN_SECRET environment variable is not defined."
                );
            }
            const accessToken = jwt.sign(
                { user: req.body.email },
                process.env.ACCESS_TOKEN_SECRET
            );
            res.json({ accessToken: accessToken });
        });
    } catch (error: any) {
        console.log(`unable to register user : ${error.message}`);
        res.status(500);
        res.json({ error: error.message });
    }
});

Router.post("/login", async (req, res, next) => {
    try {
        const userVariable = new user({
            username: req.body.username,
            password: req.body.password,
        });
        passport.authenticate("local", (err: any, user: any, info: any) => {
            const { _id, username } = user;
            console.log(user);

            //if user is undefined
            if (!_id) {
                res.status(400).json({
                    message: "incorrect username or password",
                });
            } else {
                console.log(_id);
                if (!process.env.ACCESS_TOKEN_SECRET) {
                    throw new Error(
                        "ACCESS_TOKEN_SECRET environment variable is not defined."
                    );
                }
                const accessToken = jwt.sign(
                    { user: { _id, username } },
                    process.env.ACCESS_TOKEN_SECRET
                );

                res.json({ accessToken: accessToken });
            }
        })(req, res);
    } catch (error: any) {
        console.log(`unable to login : ${error.message}`);
        res.status(500);
        res.json({ error: error.message });
    }
});

Router.get("/logout", (req, res) => {});

Router.put("/balance", verifyToken, async(req: any, res: any) => {
    try {
        const userId = req.user.user._id
        const updatedUser = await userModel.findOneAndUpdate(
            { _id:userId },
            { balances: req.body.balances }
        );
        return res
            .status(200)
            .json({ success:true,user: updatedUser, message: "balance updated" });
    } catch (error:any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default Router;
