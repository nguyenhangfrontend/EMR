import styled from 'styled-components';

export const Main = styled('div')`
  & .layout-body {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    height: calc(100vh - 60px);
    
    & .layout-middle {
      flex: 1;
      padding: 24px;
    }
    
    & .layout-right-side {
      width: 18%;
      border-left: solid 2px #dedede;
      height: 100%;
    }
    
    
  }
`;
