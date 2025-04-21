import React, { useEffect, useRef } from 'react';
import useCompass from '../hooks/useCompass';
import '../styles/Compass.css';

const Compass = () => {
  const {
    heading,
    accuracy,
    isCalibrating,
    isPortrait,
    magneticHeading,
    trueHeading,
    direction,
    requestCalibration,
    toggleOrientation,
    requestIOSPermission
  } = useCompass();
  
  const degreeMarkersRef = useRef(null);

  // Create degree markers once component mounts
  useEffect(() => {
    if (degreeMarkersRef.current) {
      const markersContainer = degreeMarkersRef.current;
      // Clear existing markers
      markersContainer.innerHTML = '';
      
      // Create new markers
      for (let i = 0; i < 360; i += 5) {
        const marker = document.createElement('div');
        marker.className = 'degree-marker';
        marker.style.transform = `rotate(${i}deg) translateY(-135px)`;
        
        // Add text for every 30 degrees
        if (i % 30 === 0) {
          const text = document.createElement('div');
          text.className = 'degree-text';
          text.textContent = i;
          text.style.transform = `rotate(${-i}deg) translateY(-120px) rotate(${i}deg)`;
          markersContainer.appendChild(text);
        }
        
        markersContainer.appendChild(marker);
      }
    }
  }, []);

  // Request iOS permission on first user interaction
  useEffect(() => {
    const handleInitialClick = () => {
      requestIOSPermission();
      document.body.removeEventListener('click', handleInitialClick);
    };
    
    document.body.addEventListener('click', handleInitialClick);
    
    return () => {
      document.body.removeEventListener('click', handleInitialClick);
    };
  }, [requestIOSPermission]);

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Online Compass</h1>
      
      <div className="flex flex-col items-center">
        <div className="compass relative mb-6">
          <div className="compass-rose">
            <div className="degree-markers" ref={degreeMarkersRef}></div>
            <div 
              className="compass-needle" 
              style={{ transform: `translate(-50%, -50%) rotate(${-heading}deg)` }}
            >
              <div className="needle-tail"></div>
              <div className="needle"></div>
            </div>
            <div className="compass-center"></div>
            <div className="north-indicator"></div>
          </div>
          <div className={`calibration ${isCalibrating ? 'active' : ''}`}>
            Move your device in a figure-8 pattern to calibrate
          </div>
          <div className="accuracy-info">Accuracy: {accuracy}</div>
          <div className="orientation-info">{heading}° {direction}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-gray-500 text-sm mb-1">Magnetic North</div>
            <div className="text-xl font-bold">{magneticHeading}°</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-gray-500 text-sm mb-1">True North</div>
            <div className="text-xl font-bold">{trueHeading}°</div>
          </div>
        </div>
        
        <div className="flex flex-col w-full">
          <button 
            onClick={requestCalibration}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-3 transition"
          >
            <i className="fas fa-sync-alt mr-2"></i> Calibrate Compass
          </button>
          <button 
            onClick={toggleOrientation}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition"
          >
            <i className={`fas fa-mobile${isPortrait ? '-alt' : ''} mr-2`}></i> Toggle Orientation
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-gray-600 text-sm text-center">
        <p>Hold your device flat to use the compass. For best results, avoid magnetic interference.</p>
      </div>
    </div>
  );
};

export default Compass;