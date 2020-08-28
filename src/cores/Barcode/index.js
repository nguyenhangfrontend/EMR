import React from "react";
import T from "prop-types";
import { Avatar } from "antd";
import { Main } from "./styled";
import BarcodeCom from 'react-barcode'
import { connect } from "react-redux";

const Barcode = ({
  mode,
  component,
  updateContent,
  form,
  formChange,
  labelText,
  init,
  focusing
}) => {
  
  const handleFocus = () => {
    if (mode === "config") {
      init(component);
    }
  };

 
  return (
    <Main onClick={handleFocus} focusing={focusing}>
      {mode === "config" && (
        <Avatar shape={"square"} icon={"barcode"} size={"large"} />
      )}
      {mode === "editing" && (
        <div className={'barcode-container'}>
          <BarcodeCom  id={'barcode'} fontSize={14} width={1} height={100} value="http://github.com/kciter" />
        </div>
        
      )}
    </Main>
  );
};

Barcode.defaultProps = {
  component: {},
  mode: 'editing',
};

Barcode.propTypes = {
  component: T.shape({}),
  mode: T.oneOf(['config', 'editing']),
};

const mapState = () => ({});

const mapDispatch = ({ component: { init } }) => ({
  init
});

export default connect(mapState, mapDispatch)(Barcode);

