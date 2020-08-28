import styled from "styled-components";
export const Main = styled.div`
  & .header {
    margin-bottom: 20px;
    align-items: center;
    width: 100%;
    display: flex;

    & .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 23px;
      /* identical to box height */

      text-transform: uppercase;

      color: #125873;
      flex: 1;
    }
    & .btn-add {
      background-color: #08aaa8;
      color: #fff;
      &:hover,
      &:focus {
        background: #08aaa8;
        color: #fff;
      }
    }
  }
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background-color: transparent;
  }
  .ant-table-tbody > tr.ant-table-row {
    cursor: pointer;
    border: none;

    &:nth-child(odd) {
      background-color: #f5f5f5;
    }

    &:hover {
      background-color: #dafaf9;
      color: #333;
    }
    &.selected-row {
      background-color: #08aaa8;
      color: #fff;
    }
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 12px 10px;
  }
  .ant-table table {
    border: 1px solid #dedede;
  }
  .ant-table-thead th {
    background-color: #125872;
    color: #fff;
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

  .ant-pagination {
    padding: 10px 0;
  }
  .action .anticon {
    padding: 3px;
    font-size: 16px;
  }
`;
