import { NextResponse } from "next/server";
import type {NextApiRequest, NextApiResponse} from "next";
import rateLimitMiddleware from "../../../limiters/rateLimiter";

async function GET (req: NextApiRequest, res: NextApiResponse) {

    try {
        res.setHeader("Set-Cookie", `token=${""}; HttpOnly; Path=/;`);
        return res.json({
            message: "Logout Successful",
            success: true,
            
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 }), {status: 500}
    }
}

export default rateLimitMiddleware(GET);
