import styled  from 'styled-components';

export const Main = styled('div')`
 & .search-item {
    min-width: 280px;
    margin: 0 6px;
 }
 .header-search {
    margin-bottom: 25px;
}
.title {
    text-transform: uppercase;
    font-size: 18px;
    margin-bottom: 23px;
}
.items-length {
    font-weight: 700;
    color: #125872;
  }
.ant-select-selection{
    border-radius: 17px;
  }
  .ant-row {
   display: flex;
    box-sizing: border-box;
    flex-wrap: wrap;
  }
  .main-selected {
    box-shadow: none;
    border: 1px solid #ddd;
  }
`