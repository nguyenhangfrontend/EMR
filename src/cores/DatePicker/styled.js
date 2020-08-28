import styled from 'styled-components';

const Main  = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;
  justify-content: center;
  width: 100%;
  
  & .date-picker {
    opacity: 0;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
  }
  
  & .value-display {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    pointer-events: none;
  }
`;

export { Main };
