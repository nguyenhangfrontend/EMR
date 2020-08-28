import styled from 'styled-components';

export const Main = styled('div')`
  padding: 12px;
  .title-list {
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    text-transform: uppercase;
    color: #125873;
    margin-bottom: 24px;
  }
  & .patient-list {
    & .ant-list-items {
      height: calc(100vh - 240px);
      overflow-y: auto;
    }
    
    & .patient-item {
      transition: background-color 0.225s;
      cursor: pointer;
      
      & .item-num {
        color: #08AAA8;
      }
    }
    
    & .patient-item:hover {
      background-color:  #dafaf9;
    }
    
    & .ant-list-header {
    }
    
    & .selected-item {
      background-color: #08AAA8;
      
      & .item-num {
        color: rgba(0, 0, 0, 0.9);
      }
    }
    
    & .selected-item:hover {
      background-color: #08aaa8;
    }
    
    & .avatar-patient {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: rgba(0, 0, 0, 0.8);
    }
  }
  
  & .patient-paging {
    padding: 12px 0 0 0;
  }
`;
