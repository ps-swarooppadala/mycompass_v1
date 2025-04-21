export const degreesToDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
};

export const simulateCompassBehavior = (degrees: number): { direction: string; degrees: number } => {
    const direction = degreesToDirection(degrees);
    return { direction, degrees };
};