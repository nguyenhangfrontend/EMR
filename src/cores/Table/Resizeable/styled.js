import styled from 'styled-components';



const ResizeElm = styled('div')`
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 3px;
  opacity: 0.6;
  right: 0;
  top: 0;
  margin: 0;
  cursor: col-resize;
  border-left: ${props => props.theme.border};
  border-right: ${props => props.theme.border};
  border-color: rgba(0, 0, 0, 0.6);
`;

export { ResizeElm };
