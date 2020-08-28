import styled from 'styled-components';

const Main = styled('div')`
  background-color: #fff;
  min-height: 60px;

  & .barcode-container {
    width: 200px;
    height: 90px;

    & svg {
      width: 100%;
      height: 100%;
    }
  }
  
  & img {
    width: 120px;
  }
`;

export { Main };
