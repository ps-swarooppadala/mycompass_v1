import { useState, useEffect, useCallback } from 'react';

type AccuracyLevel = 'High' | 'Medium' | 'Low' | 'Simulated data';
type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

interface CompassData {
  heading: number;
  accuracy: AccuracyLevel;
  isCalibrating: boolean;
  isPortrait: boolean;
}

interface UseCompassReturn {
  heading: number;
  accuracy: AccuracyLevel;
  isCalibrating: boolean;
  isPortrait: boolean;
  magneticHeading: number;
  trueHeading: number;
  direction: Direction;
  requestCalibration: () => void;
  toggleOrientation: () => void;
  requestIOSPermission: () => void;
}

interface ExtendedDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassAccuracy?: number;
}

// Add type definition for DeviceOrientationEvent.requestPermission
interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

declare global {
  interface Window {
    DeviceOrientationEvent: DeviceOrientationEventWithPermission;
  }
}

const useCompass = (): UseCompassReturn => {
  const [compassData, setCompassData] = useState<CompassData>({
    heading: 0,
    accuracy: 'High',
    isCalibrating: false,
    isPortrait: true
  });
  
  const [magneticHeading, setMagneticHeading] = useState<number>(0);
  const [trueHeading, setTrueHeading] = useState<number>(0);
  
  // Get cardinal direction based on degrees
  const getDirection = (degrees: number): Direction => {
    const directions: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Request device to calibrate the compass
  const requestCalibration = (): void => {
    if (!compassData.isCalibrating) {
      setCompassData(prev => ({
        ...prev,
        isCalibrating: true
      }));
      
      // Simulate calibration taking some time
      setTimeout(() => {
        setCompassData(prev => ({
          ...prev,
          isCalibrating: false
        }));
      }, 5000);
    }
  };

  // Toggle between portrait and landscape orientation
  const toggleOrientation = (): void => {
    setCompassData(prev => ({
      ...prev,
      isPortrait: !prev.isPortrait
    }));
    // In a real app, this would change how we handle orientation data
  };

  // Handle device orientation events
  const handleOrientation = (event: ExtendedDeviceOrientationEvent): void => {
    if (event.absolute && event.alpha !== null) {
      const heading = Math.round(event.alpha);
      
      // Update magnetic heading
      setMagneticHeading(heading);
      
      // Calculate true heading with random declination for demo
      // In a real app, you would use actual declination data for the location
      const declination = Math.round((Math.random() * 40) - 20);
      setTrueHeading(heading + declination);
      
      // Update accuracy if available
      let accuracyStatus: AccuracyLevel = 'High';
      if (event.webkitCompassAccuracy !== undefined) {
        const accuracy = event.webkitCompassAccuracy;
        accuracyStatus = accuracy < 15 ? 'High' : accuracy < 30 ? 'Medium' : 'Low';
        
        // Request calibration if accuracy is low
        if (accuracy > 30) {
          requestCalibration();
        }
      }
      
      setCompassData(prev => ({
        ...prev,
        heading,
        accuracy: accuracyStatus
      }));
    }
  };

  // Simulate compass for browsers without device orientation support
  const simulateCompass = (): void => {
    setMagneticHeading(prev => (prev + 1) % 360);
    
    // Calculate true heading with random declination for demo
    const declination = Math.round((Math.random() * 40) - 20);
    setTrueHeading(magneticHeading + declination);
    
    // Update compass data
    setCompassData(prev => ({
      ...prev,
      heading: magneticHeading
    }));
    
    // Simulate occasional calibration needed
    if (Math.random() < 0.01) {
      requestCalibration();
    }
    
    // Simulate accuracy changes
    const accuracies: AccuracyLevel[] = ['High', 'Medium', 'Low'];
    const randomAccuracy = accuracies[Math.floor(Math.random() * accuracies.length)];
    setCompassData(prev => ({
      ...prev,
      accuracy: randomAccuracy
    }));
  };

  // Request iOS permission (needs to be called from a user interaction event)
  const requestIOSPermission = useCallback((): void => {
    if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      window.DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation as EventListener);
          } else {
            // Fallback to simulation
            const intervalId = setInterval(simulateCompass, 100);
            setCompassData(prev => ({
              ...prev,
              accuracy: 'Simulated data'
            }));
            
            return () => clearInterval(intervalId);
          }
        })
        .catch(console.error);
    }
  }, []);

  // Set up compass functionality on mount
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      // Request permission for iOS 13+ devices
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        // We can't automatically request permission without user interaction
        // The component using this hook should provide a way to request permission
      } else {
        // For non-iOS devices
        window.addEventListener('deviceorientation', handleOrientation as EventListener);
      }
    } else {
      // Fallback to simulation
      intervalId = window.setInterval(simulateCompass, 100);
      setCompassData(prev => ({
        ...prev,
        accuracy: 'Simulated data'
      }));
    }
    
    // Clean up event listeners
    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
    };
  }, []);

  return {
    heading: compassData.heading,
    accuracy: compassData.accuracy,
    isCalibrating: compassData.isCalibrating,
    isPortrait: compassData.isPortrait,
    magneticHeading,
    trueHeading,
    direction: getDirection(compassData.heading),
    requestCalibration,
    toggleOrientation,
    requestIOSPermission
  };
};

export default useCompass;