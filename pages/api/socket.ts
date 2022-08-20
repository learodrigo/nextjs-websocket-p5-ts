import { Server, Socket } from "socket.io"
import { TBox } from "../../types/TBox"

const boxes: Array<TBox> = []

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    res.socket.server.io.on("connection", (socket: Socket) => {
      socket.emit("all-boxes", boxes)

      socket.on("color-box", (data: TBox) => {
        boxes.push(data)
        socket.broadcast.emit("color-box", data)
      })
    })
  } else {
    // res.socket.server.io.on("connection", (socket: Socket) => {
    //   socket.emit("all-boxes", boxes)
    // })
    console.log("already running")
  }

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
