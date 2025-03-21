import { useState } from "react";
import * as Location from "expo-location";

export function useWatchPosition(onStartWatchingPosition, onPositionUpdate) {
  const [watcher, setWatcher] = useState(null)

  async function setPositionWatcher() {
    const newWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Balanced,
        timeInterval: 1000,
        distanceInterval: 5
      },
      newLocation => {
        onPositionUpdate?.(newLocation)
      },
      error => console.error('Location.watchPositionAsync :>> ', error)
    )

    setWatcher(newWatcher)
  }

  async function startWatching() {
    if (onStartWatchingPosition)
      await onStartWatchingPosition()

    await setPositionWatcher()
  }

  async function stopWatching() {
    watcher?.remove()
    setWatcher(null)
  }

  return { startWatching, stopWatching }
}
