import styled from 'styled-components';

const Main = styled('div')`
  display: flex;
  overflow: hidden;
  width: 100%;
  flex-direction: column;
  color: #000;
  position: relative;
  
  & .action-line {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
`;

export { Main };
