import { Entity } from "./Entity";

export class Lap extends Entity {
  trackId = null;
  date = new Date();
  coordinates = [];

  constructor(trackId, date, coordinates) {
    super()

    this.trackId = trackId
    this.date = date
    this.coordinates = coordinates
  }

  addCoordinate(coordinate) {
    this.coordinates.push(coordinate)
  }
}
