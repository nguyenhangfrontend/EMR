import styled from "styled-components";

const Main = styled("div")`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  .radio-nhip-mach {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    .radio {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .ant-radio-wrapper {
        margin-right: 5px;
      }
      .radio-content {
        margin-left: 5px;
      }
    }
  }
  & .toolbar {
    flex: 1;
    background-color: #fff;
    padding: 12px;
    height: 80px;
    box-shadow: 1px 0px 20px 0px rgba(69, 104, 129, 0.33),
      0px 0px 20px 0 rgba(114, 119, 160, 0.12);
    position: relative;
    z-index: 1;
    & .toolbar-inner {
      display: content;
      .ant-btn {
        min-width: 100px;
        margin-left: 10px;
      }
      .toolbar-right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
`;

export { Main };
