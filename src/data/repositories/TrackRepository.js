import { TRACK_COLLECTION_NAME } from "../../domain/collections";

import LocalDatabase from "../../infra/storage/LocalDatabase";

export class TrackRepository {
  #key = TRACK_COLLECTION_NAME

  async getAll() {
    const tracks = await LocalDatabase.get(this.#key)

    return tracks ?? []
  }

  async getById(id) {
    const tracks = await this.getAll()

    return tracks.find(track => track.id === id)
  }

  async getByName(name) {
    const tracks = await this.getAll()

    return tracks.find(track => track.name === name)
  }

  async create() {
    return await LocalDatabase.save(this.#key, [])
  }

  async update(track) {
    const tracks = await this.getAll()

    const trackIndex = tracks.findIndex(oldTrack => track.id === oldTrack.id);

    tracks[trackIndex] = track;

    return await LocalDatabase.update(this.#key, tracks)
  }

  async addTrack(track) {
    return await LocalDatabase.push(this.#key, track)
  }

  async addCoordinate(track, coordinate) {
    if (!track?.coordinates)
      track.coordinates = []

    track.coordinates.push(coordinate)

    return await this.update(track)
  }
}
