import React, { useState, useEffect } from "react";
import p5Types from "p5";
import dynamic from 'next/dynamic'
import { Box } from "../classes/Box";
import { io, Socket } from 'socket.io-client'
import { TBox } from "../types/TBox";

let socket: Socket;
interface IComponentProps { }


const Sketch = dynamic(
  () => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

let boxes: Array<Box> = []

export const SketchBoxes: React.FC<IComponentProps> = (props: IComponentProps) => {
  const [myColor, setMyColor] = useState<number>(0)
  const [jiggle, setJiggle] = useState<number>(0)
  const [jiggleTarget, setJiggleTarget] = useState<number>(0)

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    await fetch('/api/socket')

    socket = io()

    socket.on("all-boxes", (allboxes: Array<TBox>) => {
      for (const box of allboxes) {
        if (boxes[box.index] !== undefined) {
          boxes[box.index].color = box.color
        }
      }
    })

    socket.on("color-box", (data: TBox) => {
      boxes[data.index].color = data.color
    })
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.colorMode(p5.HSB)
    p5.createCanvas(500, 500)

    setMyColor(p5.random(255))

    const gridsize = p5.width / 50

    for (let x = 0; x < p5.width; x += gridsize) {
      for (let y = 0; y < p5.height; y += gridsize) {
        const box = new Box(p5, gridsize, x, y, jiggle)
        boxes.push(box)
      }
    }

    p5.createCanvas(500, 500).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(0)

    setJiggle(p5.lerp(jiggle, jiggleTarget, 0.1))

    for (const box of boxes) {
      box.run()
    }
  };

  const colorBox = () => {
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].over()) {
        boxes[i].color = myColor
        socket.emit("color-box", { color: myColor, index: i })
      }
    }
  }

  const mousePressed = () => colorBox()
  const mouseDragged = () => colorBox()

  return <Sketch
    setup={setup}
    draw={draw}
    mousePressed={mousePressed}
    mouseDragged={mouseDragged}
  />;
};
