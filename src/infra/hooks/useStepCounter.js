import { useEffect, useState } from "react";
import { Pedometer } from "expo-sensors";

export function useStepCounter() {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  const [subscription, setSubscription] = useState(null);

  const _subscribe = async () => {
    await Pedometer.requestPermissionsAsync()

    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    (async () => {
      setSubscription(await _subscribe());
    })()

    return () => subscription?.remove();
  }, []);

  return { isPedometerAvailable, currentStepCount }
}
