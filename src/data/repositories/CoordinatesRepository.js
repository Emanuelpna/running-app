import { COORDINATES_COLLECTION_NAME } from "../../domain/collections";

import LocalDatabase from "../../infra/storage/LocalDatabase";

export class CoordinatesRepository {
  #key = COORDINATES_COLLECTION_NAME

  async getAll() {
    return await LocalDatabase.get(this.#key)
  }

  async create() {
    return await LocalDatabase.save(this.#key, [])
  }

  async addCoordinate(coordinate) {
    return await LocalDatabase.push(this.#key, coordinate)
  }
}
