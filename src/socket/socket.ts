import friendsModel from "../modals/friends";
import chatModel from "../modals/chats";
import { getIdFromToken } from "../utils/getToken";

export const SocketConnection = (io: any) => {
  io.on("connection", async (socket: any) => {
    console.log("connected");

    /**
     * You can call join to subscribe the socket to a given channel
     */
    socket.on("join", (id: string) => {
      console.log("channel id", id);
      socket.join(id);
    });

    // chat functionality
    socket.on("sendMessage", async ({ message, roomID, webtoken }) => {
      const checkVeify = await getIdFromToken(webtoken);
      if (checkVeify) {
        const { id } = checkVeify;

        const saved = await chatModel.create({
          sendby: id,
          message: message,
          roomID: roomID,
        });

        await friendsModel.updateOne(
          { _id: roomID },
          { $push: { chats: saved._id } }
        );
        const getChatData = await chatModel
          .findById(saved._id, {
            message: 1,
            _id: 1,
            createdAt: 1,
            roomID: 1,
          })
          .populate({
            path: "sendby",
            select: {
              fullname: 1,
              email: 1,
              picture: 1,
            },
          });

        io.in(roomID).emit("reciveMessage", getChatData);
      }
    });

    socket.on("disconnect", async () => {
      console.log("disconnected");
    });
  });
};
