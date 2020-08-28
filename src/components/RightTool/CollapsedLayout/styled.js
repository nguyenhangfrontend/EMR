import styled from 'styled-components';

const Main = styled('div')`
  display: flex;
  padding: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  
  & .layout-item {
    margin-bottom: 24px;
  }
  
  & .app-select-icon {
    font-size: 18px;
    
    & path {
      fill: currentcolor;
    }
  } 
  
  & .layout-app-item {
    margin-bottom: 12px;
    height: 50px;
  }
  
  & .item-action {
    margin-bottom: 12px;
  }
`;

export { Main };
