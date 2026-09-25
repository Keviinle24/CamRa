import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../models/user";
import dbConnect from "../../../../libs/dbConnect";
import * as jose from 'jose'
import rateLimitMiddleware from "../../../../limiters/rateLimiter";

dbConnect()

async function GET(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();
    const { token } = req.query
    const user = await User.findOne({ "emailToken.token": token });
    if (!user) {
        return res.status(400).json({message: "Too many requests"});
    }
    if(user.emailToken.expiredAt<Date.now()) {
        return res.status(400).json({ message: "Token Expire" });
    }
    if(user.verified){
        // user is verified
    }
    await User.findOneAndUpdate({ "emailToken.token":token }, {verified:true});

    const tokenData = {
        email: user.email,
        id: user._id.toString()
    };

    const secret = new TextEncoder().encode(process.env.JWT_SECRETKEY)
    const alg = 'HS256'

    const authToken = await new jose.SignJWT(tokenData)
        .setProtectedHeader({ alg })
        .setExpirationTime('1d')
        .sign(secret)
    res.setHeader("Set-Cookie", `token=${authToken}; HttpOnly; Path=/; Max-Age=86400`);
    return res.status(200).json({ message: "Login successful", redirect: "/" });
}
export default rateLimitMiddleware(GET);