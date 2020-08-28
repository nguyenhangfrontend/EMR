import styled from 'styled-components';

const Main = styled('div')`
  display: flex;
  width: 100%;
  position: relative;
  height: calc(100vh - 60px);

  & .app-contain {
    height: 100%;
    flex: 1;
    overflow: hidden;
  }
  
  
  & .ant-layout-sider {
    background-color: #fff;
    border-left: solid 1px #dedede;
  }
  
  & .ant-layout-sider-trigger {
    background-color: #fff;
    border-top: solid 1px #dedede;
    color: #333;
  }
`;

export { Main };
