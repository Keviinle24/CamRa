import { NextResponse } from "next/server";
import type {NextApiRequest, NextApiResponse} from "next";
import User from '../../../models/user';
import dbConnect from '../../../libs/dbConnect';
import * as jose from "jose";
import rateLimitMiddleware from "../../../limiters/rateLimiter";

dbConnect()

async function DELETE (req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.headers.cookie?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
        if(!token){
            return res.status(400).json({ error: "No token" });
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRETKEY)
        const {payload}= await jose.jwtVerify(token, secret);
        const id=payload.id
        await User.findByIdAndDelete(id)
        res.setHeader("Set-Cookie", `token=${""}; HttpOnly; Path=/;`);

        return res.json({
            message: "Logout Successful",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 }), {status: 500}
    }
}

export default rateLimitMiddleware(DELETE);
