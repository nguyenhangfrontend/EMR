import styled from "styled-components";

export const Main = styled.div`
  & .header {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    & .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 23px;
      /* identical to box height */

      text-transform: uppercase;

      color: #125873;
      flex: 1;
    }
    .btn-add {
      background-color: #08aaa8;
      color: #fff;
      &:hover,
      &:focus {
        background: #08aaa8;
        color: #fff;
      }
    }
  }

  & .ant-table-scroll {
    min-height: calc(100vh - 222px);
    & .ant-table-placeholder {
      border-bottom: none;
      height: calc(100vh - 300px);
      & .ant-empty {
        height: 100%;
      }
    }
  }

`;
