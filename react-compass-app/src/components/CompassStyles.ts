import styled from 'styled-components';

export const CompassContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  border: 10px solid #333;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Needle = styled.div`
  position: absolute;
  width: 2px;
  height: 120px;
  background-color: red;
  transform-origin: bottom;
  transition: transform 0.5s ease;
`;

export const DegreeMarker = styled.div`
  position: absolute;
  width: 2px;
  height: 10px;
  background-color: black;
  transform: rotate(${props => props.angle}deg);
  top: 0;
  left: 50%;
  margin-left: -1px;
`;

export const CenterDot = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: black;
  border-radius: 50%;
  z-index: 1;
`;