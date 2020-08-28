import styled from "styled-components";

export const Main = styled("div")`
  .ant-form-item-label {
    line-height: normal;
    font-weight: 500;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .title {
    color: #165974;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
    h4 {
      text-transform: uppercase;
      font-weight: 700;
      color: #165974;
      margin-bottom: 0;
      line-height: normal;
    }
  }
  .ant-btn.btn-create {
    min-width: 130px;
    margin: 6px;
  }
  .label-info {
    min-width: 76px;
    display: inline-block;
    font-weight: 500;
    margin-right: 6px;
  }
  .ant-spin-container {
    padding-top: 12px;
  }
  .patient-info {
    background-color: #0af1ee1a;
    padding: 12px 24px;
    margin: 12px -24px;

    .info-content {
      &.patient-doccument {
        color: #e03632;
        font-weight: 500;
      }
      &.patient-name {
        color: #08aaa8;
        font-weight: 500;
      }
    }
    .info-item {
      margin-top: 3px;
    }
  }
  .select-file {
      padding-top: 12px;
      .label-info{
        display: block;
      }
    }
  .upload {
    margin-top: 24px;
  }
  .file-info {
     margin-top: 10px;
    .file-name {
      color: #08AAA8;
      display: inline-block;
      width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
    .remove {
      color: #ff7875;
      vertical-align: middle;
    }
  }
 
`;
