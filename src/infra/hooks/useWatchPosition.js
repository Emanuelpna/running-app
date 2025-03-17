import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useWatchPosition(onStartWatchingPosition, onPositionUpdate) {
  const [watcher, setWatcher] = useState(null)

  async function startWatching() {
    const newWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Balanced,
        timeInterval: 1000,
        // distanceInterval: 5
      },
      newLocation => {
        onPositionUpdate?.(newLocation)
      }
    )

    setWatcher(newWatcher)
  }

  useEffect(() => {
    startWatching()

    onStartWatchingPosition?.()

    return () => {
      watcher?.remove()
      setWatcher(null)
    }

  }, [])
}
