import styled from "styled-components";

export const Main = styled("div")`
  & .layout-body {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    height: calc(100vh - 60px);

    & .layout-middle {
      flex: 1;
      padding: 24px;
      & .ant-card-body {
        height: calc(100vh - 100px);
        overflow: auto;
        padding: 8px !important;
        & .ant-btn {
          padding: 0px 5px;
        }
      }
    }

    & .layout-right-side {
      width: 18%;
      border-left: solid 2px #dedede;
      height: 100%;
    }
  }
`;
