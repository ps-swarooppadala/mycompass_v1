export type CompassDirection = 'N' | 'E' | 'S' | 'W' | 'NE' | 'SE' | 'SW' | 'NW';

export interface CompassProps {
    direction: CompassDirection;
    accuracy: number;
    calibrated: boolean;
}

export interface CompassState {
    direction: CompassDirection;
    accuracy: number;
    calibrated: boolean;
}