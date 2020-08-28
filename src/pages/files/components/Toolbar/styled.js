import styled from "styled-components";

const Main = styled("div")`
  border-bottom: solid 1px #dedede;
  
  & .toolbar {
    background-color: #fff;
    padding: 12px;
    box-shadow: 1px 0 20px 0 rgba(69,104,129,0.33), 0px 0px 20px 0 rgba(114,119,160,0.12);
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    
    & .text-btn {
      min-width: 90px;
    }
    
    & .toolbar-left {
      width: 70%;
      border-right: solid 1px #dedede;
      display: flex;
      justify-content: space-between;
      
      & .editor-tool {
        display: flex;
      }
      
      & .file-system-tool:last-child {
        margin-right: 12px;
      }
    }
    
    .item-tool {
      margin-left: 12px;
    }
    
    .toolbar-right {
      width: 30%;
      display: flex;
      align-items: center;
      margin-left: 12px;
      
      & .file-selection {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        
        & .arrow-btn {
          border: none;
          width: 24px;
          background: none;
          cursor: pointer;
          outline: none;
        }
        
        & .file-name-d {
          cursor: pointer;
          color: #08AAA8;
          
          & .file-name-text {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
       
        
        & .arrow-btn:hover {
          color: #08AAA8;
          background-color: #dafaf9;
        }
      }
      
    }
  }
`;

export { Main };
