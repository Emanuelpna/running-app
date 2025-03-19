import { Entity } from "./Entity";

export class Track extends Entity {
  name = '';
  laps = []

  constructor(name, laps) {
    super()

    this.name = name
    this.laps = laps
  }

  addCoordinate(lap) {
    this.laps.push(lap)
  }
}
