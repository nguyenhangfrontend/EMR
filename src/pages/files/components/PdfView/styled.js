import styled from "styled-components";
export const Main = styled.div`
  .ant-card-body {
    padding: 0;
  }
  #pdfDocument {
    height: 670px;
    width: 840px;
    margin: auto;
    display: block;
  }

  .pdf-view {
    border: 1px solid #ddd;
    padding: 10px;
    border-top: 0;
    border-bottom: 0;
  }
  canvas.react-pdf__Page__canvas {
    /* width: 788px !important;
    height: 920px !important; */
    margin: auto;
  }
  .action {
    display: flex;
    align-items: center;
    padding: 10px;
    justify-content: center;

    .pager {
      padding: 0 6px;
    }
    .previous,
    .next,
    .download {
      font-size: 14px;
      padding: 6px;
      cursor: pointer;
    }
    span.divider {
      margin-left: 12px;
    }
    .divider-right {
      margin-right: 12px;
    }
  }
  .react-pdf__Document {
    background-color: #000;
    padding: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    border-top: 0;
    border-bottom: 0;
    height: calc(100vh - 260px);
    overflow: hidden;
    overflow-y: auto;
  }

  .history-list {
    padding-top: 15px;
  }
  .sign-container {
    padding: 10px;
    .item-btn {
      width: 100%;
      margin-bottom: 20px;
    }
  }
  .ant-tree li .ant-tree-node-content-wrapper {
    height: auto;
    width: 100%;
  }
`;
