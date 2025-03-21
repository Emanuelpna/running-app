import { Entity } from "./Entity";

export class Coordinate extends Entity {
  trackId = null;
  latitude = 0;
  longitude = 0;

  constructor(trackId, latitude, longitude) {
    super()

    this.trackId = trackId
    this.latitude = latitude
    this.longitude = longitude
  }
}
