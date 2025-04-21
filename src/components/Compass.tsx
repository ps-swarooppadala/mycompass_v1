import React, { useEffect, useRef } from 'react';
import useCompass from '../hooks/useCompass';
import '../styles/Compass.css';

const Compass: React.FC = () => {
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
  
  const degreeMarkersRef = useRef<HTMLDivElement>(null);

  // Create degree markers once component mounts
  useEffect(() => {
    if (degreeMarkersRef.current) {
      const markersContainer = degreeMarkersRef.current;
      // Clear existing markers
      markersContainer.innerHTML = '';
      
      const radius = 135; // Distance from center to markers
      
      // Create new markers
      for (let i = 0; i < 360; i += 5) {
        // Convert degrees to radians for positioning
        const rad = (i - 90) * (Math.PI / 180);
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
        
        const marker = document.createElement('div');
        marker.className = 'degree-marker';
        
        // Make markers at cardinal points and every 30 degrees taller
        if (i % 30 === 0) {
          marker.style.height = '15px';
        }
        
        marker.style.transform = `translate(${x}px, ${y}px) rotate(${i}deg)`;
        markersContainer.appendChild(marker);
        
        // Add text for every 30 degrees
        if (i % 30 === 0) {
          const labelRadius = radius - 25; // Place text inside the markers
          const textX = labelRadius * Math.cos(rad);
          const textY = labelRadius * Math.sin(rad);
          
          const text = document.createElement('div');
          text.className = 'degree-text';
          text.textContent = i === 0 ? 'N' : 
                             i === 90 ? 'E' : 
                             i === 180 ? 'S' : 
                             i === 270 ? 'W' : i.toString();
          
          // Position text and ensure it's readable
          text.style.transform = `translate(${textX}px, ${textY}px)`;
          markersContainer.appendChild(text);
        }
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