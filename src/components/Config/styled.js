import styled from 'styled-components'
import { A4, FORM_HEIGHT } from 'components/constanst';

const Main = styled('div')`
  background-color: #001529;
  width: 100%;
  height: calc(100vh - 60px);
  padding-top: 24px;
  font-family: "Times New Roman", sans-serif;
  font-size: ${props => props.fontSize}pt;

  & .creation-contain {
    margin-right: auto;
    margin-left: auto;
    overflow-y: auto;
    height: calc(100vh - 128px);
    background-color: #fff;
    width: ${A4.width}px;
    padding: 12px;
  }
  
  & .creation-contain::-webkit-scrollbar {
    display: none;
  }
`;

const Content = styled('div')`
  min-height: ${FORM_HEIGHT}px;
  overflow-x: hidden;
`;

export { Main, Content }
