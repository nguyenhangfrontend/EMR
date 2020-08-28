import styled from "styled-components";

export const Main = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  & .search-input {
    width: auto;
  }
  & .search-item {
    margin-right: 10px;
    border-radius: 20px;
    input {
      border-radius: 4px;
      width: 100%;
    }
  }
  .ant-select-selection {
    border-radius: 4px;
  }
  .btn-add {
    background-color: #08AAA8;
    color: #fff;
    &:hover, &:focus {
      background: #08AAA8;
      color: #fff;
    }

  }

`;
