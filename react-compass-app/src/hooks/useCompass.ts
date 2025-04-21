import { useEffect, useState } from 'react';

const useCompass = () => {
    const [direction, setDirection] = useState(0);
    const [error, setError] = useState(null);
    const [isCalibrating, setIsCalibrating] = useState(false);

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) {
                setDirection(event.alpha);
            }
        };

        const handleError = (event: Event) => {
            setError(event);
        };

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('error', handleError);
        };
    }, []);

    const calibrate = () => {
        setIsCalibrating(true);
        // Add calibration logic here
        setTimeout(() => {
            setIsCalibrating(false);
        }, 3000); // Simulate calibration time
    };

    return { direction, error, isCalibrating, calibrate };
};

export default useCompass;