import { Entity } from "./Entity";

export class Track extends Entity {
  name = '';
  date = new Date()
  coordinates = []

  constructor(name, date, coordinates) {
    super()

    this.name = name;
    this.date = date;
    this.coordinates = coordinates;
  }

  addCoordinate(coordinate) {
    this.coordinates.push(coordinate)
  }
}
