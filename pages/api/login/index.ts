import dbConnect from '../../../libs/dbConnect';
import User from '../../../models/user';
import bcryptjs from 'bcryptjs';
import * as jose from "jose"
import type { NextApiRequest, NextApiResponse } from "next";
import rateLimitMiddleware from "../../../limiters/rateLimiter";

dbConnect();

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(401).json({ error: "Email and Password are required" });
        }

        const user = await User.findOne({ email });
        if (!user){
          return res.status(400).json({ error: "Login details are incorrect" });
        }
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ error: "Login details are incorrect" });
        }
        if(!user.verified){
          return res.status(401).json({ error: "Email hasn't been verified" });
        }

        const tokenData = {
          email: user.email,
          id: user._id.toString()
        };

        const secret = new TextEncoder().encode(process.env.JWT_SECRETKEY)
        const alg = 'HS256'

        const token = await new jose.SignJWT(tokenData)
            .setProtectedHeader({ alg })
            .setExpirationTime('1d')
            .sign(secret)
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=86400`);
        return res.status(200).json({ message: "Login successful", redirect: "/" });
      } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ error: "Something went wrong" });
      }
    default:
      return res.status(400).json("No method for this endpoint");
  }
}

export default rateLimitMiddleware(handler);