import { LAP_COLLECTION_NAME, } from "../../domain/collections";

import LocalDatabase from "../../infra/storage/LocalDatabase";

export class LapRepository {
  #key = LAP_COLLECTION_NAME

  async getAll() {
    return await LocalDatabase.get(this.#key)
  }

  async getAllByTrackId(trackId) {
    const laps = await LocalDatabase.get(this.#key)

    return laps.filter(lap => lap.trackId === trackId)
  }

  async create() {
    return await LocalDatabase.save(this.#key, [])
  }

  async addLap(lap) {
    if (!(await LocalDatabase.hasKey(this.#key)))
      await this.create()

    return await LocalDatabase.push(this.#key, lap)
  }

  async addCoordinatesToLap(lapId, coordinates) {
    const laps = await LocalDatabase.get(this.#key)

    const lapIndex = laps.findIndex(lap => lap.id === lapId)

    if (lapIndex < 0) return

    laps[lapIndex]?.coordinates?.push(coordinates)

    return await LocalDatabase.save(this.#key, laps)
  }
}
