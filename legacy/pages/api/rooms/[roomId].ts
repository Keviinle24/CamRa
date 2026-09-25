// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../libs/dbConnect";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import { RtmTokenBuilder, RtmRole } from "agora-access-token";
import Room from "../../../models/Room";
import verifyInRoom from "../../../utils/verifyInRoom";
import rateLimitMiddleware from "../../../limiters/rateLimiter";

type Room = {
  status: String;
};

type ResponseData = Room[] | string;

function getRtmToken(userId: string) {
  const appID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERT!;
  const account = userId;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const token = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    account,
    RtmRole.Rtm_User,
    privilegeExpiredTs
  );
  return token;
}

function getRtcToken(roomId: string, userId: string) {
  const appID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERT!;
  const channelName = roomId;
  const account = userId;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithAccount(
    appID,
    appCertificate,
    channelName,
    account,
    role,
    privilegeExpiredTs
  );

  return token;
}

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { method, query } = req;

  const roomId = query.roomId as string;
  const userId = query.userId as string;


  const inRoom = await verifyInRoom(roomId, userId);
  if (!inRoom){
    return res.status(400).json("no method for this endpoint");
  }

  await dbConnect();

  switch (method) {
    case "GET": {
      const room = await Room.findById(roomId);
      res.status(200).json({
        room,
      });
      break;
    } case "PUT": {
      const room = await Room.findByIdAndUpdate(roomId, {
        status: "waiting",
      });
      room.callers = room.callers.filter(e => e !== userId)
      room.save();
      console.log("Updated to waiting:", roomId, "Removed: ", userId)
      res.status(200).json("success");
      break;
    } case "DELETE": {
      await Room.findByIdAndDelete(roomId);
      console.log("deleted room:", roomId);
      res.status(200).json("success");
      break;
    } default:
      res.status(400).json("no method for this endpoint");
      break;
  }
}

export default rateLimitMiddleware(handler);