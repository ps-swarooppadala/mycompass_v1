import React from 'react';
import { useCompass } from '../hooks/useCompass';
import './CompassStyles.ts';

const Compass: React.FC = () => {
    const { direction, error } = useCompass();

    return (
        <div className="compass">
            {error ? (
                <div className="error">Error: {error}</div>
            ) : (
                <div className="needle" style={{ transform: `rotate(${direction}deg)` }} />
            )}
            <div className="degree-markers">
                {Array.from({ length: 360 }, (_, index) => (
                    <div key={index} className="marker" style={{ transform: `rotate(${index}deg)` }}>
                        {index % 30 === 0 && index !== 0 ? index : ''}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Compass;