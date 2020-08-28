import styled from "styled-components";

const Main = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 60px;
  
  & .left-side-header {
    display: flex;
    align-items: center;
    
    & .left-side-header-title {
      font-size: 18px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 700;
    }
  }

  & .logo-link {
    display: flex;
    width: 216px;
  }
  
  & .document {
    margin-right: 24px;
  }

  & .header-icon {
    flex: 1 1 0%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    & .use-info-header {
      display: flex;
      justify-content: flex-end;
      margin: 0 20px;
    }

    & .app-language,
    & .app-notification {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      margin: 0 20px;
    }
    & .app-notification {
      & .notification-contain {
        line-height: initial;
        position: absolute;
        & .badge {
          color: #fff;
          background: red;
          font-size: 8px;
          padding: 3px;
          border-radius: 10px;
          position: absolute;
          top: -6px;
          right: -6px;
        }
      }
    }
  }
`;

export { Main };
