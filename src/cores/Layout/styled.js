import styled from 'styled-components';

const Main = styled('div')`
  background-color: #fff;
  position: relative;
  border: ${props => props.border ? 'solid 1px #000' : 'unset'};
  
  & .mark-focus {
    position: absolute;
    width: 100%;
    height: 3px;
    top: -3px;
    background-color: #1890ff;
    display: none;
    cursor: pointer;
  }
  
  &:hover {
   & .mark-focus {
    display: ${props => props.mode === 'config'? 'block': 'none'};
  }
  }
`;

export { Main };
