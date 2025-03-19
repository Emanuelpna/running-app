import { Entity } from "./Entity";

export class Coordinate extends Entity {
  lapId = null;
  latitude = 0;
  longitude = 0;

  constructor(lapId, latitude, longitude) {
    super()

    this.lapId = lapId
    this.latitude = latitude
    this.longitude = longitude
  }
}
