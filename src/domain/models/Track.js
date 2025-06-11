import { Entity } from "./Entity";

export class Track extends Entity {
  name = '';
  stepCount = 0
  coordinates = []
  date = new Date()

  constructor(name, date, coordinates = [], stepCount = 0) {
    super()

    this.name = name;
    this.date = date;
    this.coordinates = coordinates;
    this.stepCount = stepCount
  }

  addCoordinate(coordinate) {
    this.coordinates.push(coordinate)
  }

  addStepCount(stepCount) {
    this.stepCount = stepCount
  }
}
