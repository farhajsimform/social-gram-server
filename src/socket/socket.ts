export const SocketConnection = (io) => {
    console.log('called')
  io.on("connection", async (socket) => {
    console.log("connected");

    /**
     * You can call join to subscribe the socket to a given channel
     */
    socket.on("join", (id: string) => {
      socket.join(id);
    });

    socket.on("disconnect", async () => {
        console.log('disconnected')
    });
  });
};
