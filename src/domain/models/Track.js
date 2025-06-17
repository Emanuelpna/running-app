import { Entity } from "./Entity";

export class Track extends Entity {
  name = '';
  stepCount = 0
  coordinates = []
  startDate = new Date()
  finishDate = null

  constructor(name, startDate, coordinates = [], stepCount = 0) {
    super()

    this.name = name;
    this.startDate = startDate;
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
