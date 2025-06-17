import { distanceCalculator } from "../DistanceCalculator";

export class TrackReports {
  trackRepository;

  constructor(trackRepository) {
    this.trackRepository = trackRepository
  }

  async getCountOfTracksByMonth() {
    const tracks = await this.trackRepository.getAll()

    const tracksByMonth = tracks.reduce((acc, curr) => {
      const startDate = new Date(curr.startDate ?? curr.date)

      const monthNumber = startDate?.getMonth()

      if (!monthNumber) return acc

      if (!acc[monthNumber]?.lenght > 0) {
        acc[monthNumber] = []
      }

      acc[monthNumber].push(curr)

      return acc
    })

    return tracksByMonth
  }

  async getDaysRunned() {
    const tracks = await this.trackRepository.getAll()

    return tracks.map(track => ({ date: track.startDate ?? track.date, count: track.stepCount ?? 0 }))
  }

  async getAveragePace() {
    const tracks = await this.trackRepository.getAll()

    const paces = tracks.map(track => {
      const distance = distanceCalculator.calculateDistance(track.coordinates)

      const totalTimeInMiliseconds = track.finishDate.getTime() - track.startDate.getTime()

      const totalTimeInMinutes = totalTimeInMiliseconds / 1000 / 60

      const pace = totalTimeInMinutes / distance

      return pace
    })

    const averagePace = paces.reduce((acc, curr) => acc + curr, 0) / paces.length;


  }
}
