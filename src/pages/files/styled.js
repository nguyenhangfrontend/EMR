import styled from "styled-components";
import { A4, FORM_HEIGHT } from "components/constanst";

const Main = styled("div")`
  height: calc(100vh - 60px);
  overflow: hidden;
  
  & .document-name {
    padding-bottom: 12px;
    font-weight: 500;
    color: #125873;
  }
  
  
  & .view-file-mode {
    font-family: "Times New Roman", sans-serif;
    color: black;
  
    & table {
      font-size: 13px;
    }
    
    & .page-inside {
      margin-bottom: 60px;
    }
  }

  & .layout-body {
    display: flex;
    width: 100%;

    & .layout-middle {
      height: 100%;
      flex: 1;
      
      & .editing-contain {
        background-color: #eef5fa;
        height: calc(100vh - 116px);
        padding-top: 24px;
        position: relative;
        overflow: hidden;

        & .editing-box {
          margin-right: auto;
          margin-left: auto;
          overflow-y: auto;
          height: calc(100vh - 160px);
          background-color: #fff;
          width: ${A4.width + 36}px;
          padding: 0 12px;
          max-height: ${A4.height}px;
          box-shadow: 0 24px 24px -18px rgba(69, 104, 129, 0.33),
            0 9px 45px 0 rgba(114, 119, 160, 0.12);
          border-radius: 4px;
        }

        & .editing-box::-webkit-scrollbar {
          display: none;
        }

        & .form-content {
          min-height: ${FORM_HEIGHT}px;
          background-color: #fff;
          margin: 12px 0;
        }

      }
    }

    @media screen and (max-width: 1200px) {
      .layout-middle {
        zoom: 89%;
      }
    }
  }
`;

export { Main };
