import React, { useEffect, useState, useRef } from "react";
import T from "prop-types";
import { Main } from "./styled";
import { isEmpty } from "lodash";
import { connect } from "react-redux";

const InputNumber = ({
  mode,
  component,
  updateContent,
  form,
  formChange,
  labelText,
  init,
  focusing,
}) => {
  const itemProps = component.props || {};
  const [value, setValue] = useState([]);
  const elRef = useRef([]);
  const singleRef = useRef([]);
  useEffect(() => {
    if (itemProps.quantity) {
      const arrEmpty = [];
      arrEmpty.length = itemProps.quantity;
      arrEmpty.fill("");
      setValue(arrEmpty && arrEmpty);
    }
   
  }, [form, itemProps]);
  const handleFocus = () => {
    if (mode === "config") {
      init(component);
    }
  };


  const handleChangeInput = index => {
    let valueItem = elRef.current[index];
    let param;
    const values = form && form[itemProps.fieldName];
    if (itemProps.fieldName) {
      values[index] = valueItem && valueItem.innerHTML;
      const valueChanged = values && values.join("");
      param = {
        htmlLabe: valueChanged,
        htmlValue: values
      };
       formChange[itemProps.fieldName](param);
    }
   
  };

  return (
    <Main onClick={handleFocus} focusing={focusing} size={itemProps.size}>
      {mode === "config" && (
        <div className="contenteditable">
          {!isEmpty(value) ? (
            value.map((item, index) => (
              <span
                key={index}
                ref={el => (elRef.current[index] = el)}
                className="contenteditable-item"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="contenteditable-item" />
          )}
        </div>
      )}

      {mode === "editing" && (
        <div className="contenteditable">
          {!isEmpty(value) ? (
            value.map((item, index) => (
              <span
                key={index}
                ref={el => (elRef.current[index] = el)}
                contentEditable={`${!itemProps.disabled}`}
                suppressContentEditableWarning
                onInput={e => handleChangeInput(index, e)}
                className="contenteditable-item"
              >
                {form && itemProps.fieldName && form[itemProps.fieldName]
                  ? form[itemProps.fieldName][index]
                  : ""}
              </span>
            ))
          ) : (
            <span
              ref={el => (singleRef.current = el)}
              className="contenteditable-item"
              contentEditable={`${!itemProps.disabled}`}
              suppressContentEditableWarning
              onInput={handleChangeInput}
            />
          )}
        </div>
      )}
    </Main>
  );
};

InputNumber.defaultProps = {
  component: {
    props: {
      inputList: []
    }
  },
  mode: "editing"
};

InputNumber.propTypes = {
  component: T.shape({}),
  mode: T.oneOf(["config", "editing"])
};

const mapState = () => ({});

const mapDispatch = ({ component: { init } }) => ({
  init
});

export default connect(mapState, mapDispatch)(InputNumber);
