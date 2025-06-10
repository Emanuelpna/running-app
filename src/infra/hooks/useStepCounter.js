import { useEffect, useState } from "react";
import { Pedometer } from "expo-sensors";

export function useStepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const [subscription, setSubscription] = useState(null);

  const subscribe = async () => {
    await Pedometer.requestPermissionsAsync()

    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    (async () => {
      setSubscription(await subscribe());
    })()

    return () => subscription?.remove();
  }, []);

  return { isPedometerAvailable, pastStepCount, currentStepCount, subscribe }
}
