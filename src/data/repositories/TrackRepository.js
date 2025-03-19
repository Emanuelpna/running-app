import { TRACK_COLLECTION_NAME } from "../../domain/collections";

import LocalDatabase from "../../infra/storage/LocalDatabase";

export class TrackRepository {
  #key = TRACK_COLLECTION_NAME

  async getAll() {
    return await LocalDatabase.get(this.#key)
  }

  async getByName(name) {
    const tracks = await this.getAll()

    return tracks.find(track => track.name === name)
  }

  async create() {
    return await LocalDatabase.save(this.#key, [])
  }

  async update(tracks) {
    return await LocalDatabase.update(this.#key, tracks)
  }

  async addTrack(track) {
    return await LocalDatabase.push(this.#key, track)
  }
}
