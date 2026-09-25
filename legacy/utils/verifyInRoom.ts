import dbConnect from "../libs/dbConnect"
import Room from "../models/Room";

dbConnect();

export default async function verifyInRoom(roomId: string, userId: string, ): Promise<boolean> {
    const room = await Room.findById(roomId);
    if (room.callers.includes(userId)){
        return true
    }
    return false
}
