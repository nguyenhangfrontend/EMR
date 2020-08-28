import styled from "styled-components";

export const Main = styled('div')`
  & .forms-contain {
    overflow: auto;
    margin-top: 12px;
    height: calc(100vh - 212px);
    
  }
  
  & .title-value {
    display: inline-block;
    width: 120px;
  }
  
  & .files-title-switch {
    margin-left: 12px;
  }
  
  & .sub-files-title {
    font-weight: normal;
    margin-left: 6px;
  }

  & .ant-tree-title{
    & .main-title {
      display: inline-block;
      position: relative;
      
      & .tree-delete-icon {
        position: absolute;
        right: 0;
        top: 5px;
        cursor: pointer;
      }
      
      & .tree-delete-icon:hover {
        color: #f5222d;
      } 
    }
    
    
    & .level-1 {
      width: ${props => props.width - 54}px;
    }
    
    & .level-2 {
      width: ${props => props.width - 72}px;
    }
  
    & .file-name-render {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    
    & .item-level-1 {
      width: ${props => props.width - 78}px;
    }
    
    & .item-level-2 {
      width: ${props => props.width - 86}px;
    }
  }
  
  .title-form {
    font-weight: bold;
  }
  
  & .files-list-title-input {
    position: absolute;
    width: 0;
    z-index: 1;
    right: 0;
    transition: width 0.225s ease-in-out;
  }

  & .files-list-title-input-focus {
      width: 100%;
  }
  
  .files-list-title {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    height: 19px;
  }
  
  .files-list-title-text {
    position: absolute;
    width: 100%;
    z-index: 0;
  }
  
  .files-list-title-input {
    position: absolute;
    width: 0;
    z-index: 1;
    right: 0;
    opacity: 0;
    transition: all 0.225s ease-in-out;
  }
  
  .files-list-title-input-focus {
     width: 100%;
     opacity: 1;
  }
  
  .files-list-search-icon {
      position: absolute;
      right: 8px;
      z-index: 2;
  }
  
  .files-list-search-icon:hover {
      color: #08AAA8;
      cursor: pointer;
  }
  
  & .file-list-add {
    position: relative;
    height: 24px;
    width: 100%;
    
    & .file-list-add-select {
      position: absolute;
      z-index: 1;
      top: 0;
    }
    
    .file-list-add-select-focus {
      width: 100%;
    }
    
    & .file-list-add-btn {
      position: absolute;
      z-index: 2;
      top: 0;
      color: #08AAA8;
      transition: all 0.225s ease-in-out;
    }
    
    & .file-list-add-btn-visible {
      opacity: 0;
      pointer-events: unset;
      z-index: 0;
    }
  }
`;
