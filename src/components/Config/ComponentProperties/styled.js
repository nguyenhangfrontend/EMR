import styled from 'styled-components';

const Main = styled('div')`
  position: relative;
  
  & .component-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  & .properties-contain {
    height: 340px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  & .props-form-item {
    margin-bottom: 0;
  }
  
  & .delete-btn {
   min-width: 30px;
  }

`;

export { Main };
