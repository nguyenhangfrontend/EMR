import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import T from 'prop-types';
import { Main } from './styled';
import CheckBox from 'cores/CheckBox';
import { connect } from "react-redux";

const Groups = forwardRef((props, ref) => {
  const { component, mode, formChange, form, init } = props;
  const [itemFocused, setItemFocus] = useState({});
  const [values, setValues] = useState([]);
  const [localCheckList, setLocalCheckList] = useState([]);

  const mainRef = useRef(null);
  const itemProps = component.props || {};
  
  useImperativeHandle(ref, () => ({
    collectCheckList: () => localCheckList
  }));

  const handleFocusItem = (item) => () => {
    setItemFocus(item);
  };
  
  useEffect(() => {
    setLocalCheckList(itemProps.checkList);
  }, [itemProps]);

  useEffect(() => {
    setValues(form[itemProps.fieldName] || []);
  }, [form]);

  const handleBlueItem = () => {
    setItemFocus({});
  };

  const handleFocus = () => {
    if (mode === 'config') {
      init(component);
    }
  };

  const handleOnChange = (value) => {
    if (itemProps.disabled) {
      return;
    }


    if (itemProps.type === 'onlyOne') {


      if (values.includes(value)) {
        setValues([]);
        itemProps.fieldName && formChange[itemProps.fieldName]([]);
      } else {
        setValues([value]);
        itemProps.fieldName && formChange[itemProps.fieldName]([value]);
      }

    } else {
      if (values.includes(value)) {
        const newList = values.filter(item => item !== value);
        setValues(newList);
        itemProps.fieldName && formChange[itemProps.fieldName](newList);
      } else {
        let newList = values;
        newList = [...newList, value];
        setValues(newList);
        itemProps.fieldName && formChange[itemProps.fieldName](newList);
      }
    }
  };

  const handleUpdateData = (data) => {
    const newList = localCheckList.map(item => item.key === data.key ? data : item);

    setLocalCheckList(newList);
  };

  return (
    <Main ref={mainRef} onClick={handleFocus}>
      {localCheckList && localCheckList.length > 0 ? localCheckList.map(item => (
        <div
          key={item.key}
          onClick={handleFocusItem(item)}
          onBlur={handleBlueItem}
          className={`${itemFocused.key === item.key ? 'check-item-focused' : ''} check-item`}
        >
          <CheckBox
            handleUpdateData={handleUpdateData}
            handleOnChange={handleOnChange}
            item={item}
            checked={values.length ? values.includes(item.value) : [`${values}`].includes(item.value)}
            mode={mode}
            direction={itemProps.direction}
          />
        </div>
      )) : <span>{'groups'}</span>}
    </Main>
  );
});

// direction: rtl: right to left or ltr: left to right

Groups.defaultProps = {
  form: {},
  component: {
    props: {
      checkList: [],
      direction: 'ltr'
    },
  },
  line: {},
  disabled: false,
  mode: 'config',
};

Groups.propTypes = {
  form: T.shape({}),
  component: T.shape({}),
  line: T.shape({}),
  updateContent: T.func,
  disabled: T.bool,
  mode: T.string,
};

const mapState = () => ({});

const mapDispatch = ({ component: { init } }) => ({
  init
});

export default connect(mapState, mapDispatch, null, { forwardRef: true })(Groups);
