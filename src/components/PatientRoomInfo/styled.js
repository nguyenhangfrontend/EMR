import styled from "styled-components";
export const Main = styled.div`
  & .ant-row {
    display: flex;
    flex-wrap: wrap;
  }
  .title-list {
    font-size: 24px;
  }

  & .card-container {
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.1);
    height: 100%;
    min-height: 400px;
    &.empty .ant-card-body{
      display: flex;
      height: calc(100% - 50px);
      align-items: center;
      justify-content: center;
    }
    .ant-card-head {
      border-bottom: 0;
    }
    .ant-card-head-title {
      padding: 12px 0;
      font-weight: 500;
      color: #125873;
      text-transform: uppercase;
    }
  }
`;
