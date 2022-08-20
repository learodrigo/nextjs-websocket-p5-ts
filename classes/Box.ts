import p5Types from "p5"

export class Box {
  p5: p5Types
  size: number
  x: number
  y: number
  jiggle: number
  color: number | undefined

  constructor(p5: p5Types, size: number, x: number, y: number, jiggle: number) {
    this.p5 = p5
    this.size = size
    this.x = x
    this.y = y
    this.jiggle = jiggle
    this.color = undefined
  }

  over() {
    return (
      this.p5.mouseX >= this.x &&
      this.p5.mouseX < this.x + this.size &&
      this.p5.mouseY >= this.y &&
      this.p5.mouseY < this.y + this.size
    )
  }

  run() {
    this.p5.stroke(5)

    if (this.over()) {
      this.p5.fill(255)
    } else if (this.color) {
      this.p5.fill(this.color, 255, 255)
    } else {
      this.p5.fill(0)
    }

    const x = this.x + this.p5.random(-this.jiggle, this.jiggle)
    const y = this.y + this.p5.random(-this.jiggle, this.jiggle)

    this.p5.rect(x, y, this.size, this.size)
  }
}
