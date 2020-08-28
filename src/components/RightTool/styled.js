import styled from "styled-components";

const Main = styled("div")`
  height: 100%;
  background-color: #fff;

  & .menu-app-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &.selected .icon-app {
      background: linear-gradient(137.72deg, #fe5956 7.21%, #9e2b2a 96.96%);
    }
    .icon-app {
      background: linear-gradient(136deg, #20d0ce 4.05%, #165974 96.56%);
      border-radius: 5px;
      width: 55px;
      height: 55px;
      justify-content: center;
      align-items: center;
      color: #fff;
      display: flex;
      &:hover {
        background: linear-gradient(137.72deg, #fe5956 7.21%, #9e2b2a 96.96%);
      }

      .anticon svg {
        display: inline-block;
        font-size: 23px;
      }
    }
    .text-app {
      text-align: center;
      color: #333;
    }
  }

  & .menu-app-item:hover {
    border-color: #08aaa8;
  }
  
  .ant-card-head-title {
  }
`;

export { Main };
