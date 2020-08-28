import styled from 'styled-components';

const Main = styled('span')`
  & .edit-contain {
    outline: none;
  }
  
  & .resize-contain {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export { Main };
