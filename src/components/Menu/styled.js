import styled from 'styled-components'

const Main = styled('div')`
  & .ant-menu {
    & svg > path {
      fill: currentColor;
    }
  }
`;

export { Main }
