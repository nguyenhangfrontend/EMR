import styled from "styled-components";

export const Main = styled("div")`
  & .user-info {
    height: 60px;
    display: flex;
    align-items: center;
    
    & .user-name {
      cursor: pointer;
      font-weight: bold;
      font-size: 16px;
      margin: 0 10px;
      color: #fff;
    }
  }
`;
