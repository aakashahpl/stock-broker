import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
dotenv.config();

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    balances: {
        USD: Number,
        stocks: {
            type: mongoose.Schema.Types.Mixed,
        },
    },

});
userSchema.plugin(passportLocalMongoose);

const userModel = mongoose.model("user", userSchema);
passport.use(userModel.createStrategy());

export default userModel;
