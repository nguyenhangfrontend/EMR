import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { DatePicker } from 'antd';
import { Main } from './styled';
import { render, formatSecond } from './constants';

const AppDatePicker = (props) => {
  const { mode, component, init, form, formChange } = props;
  const [localValue, setLocalValue] = useState();

  const itemProps = component.props || {};

  useEffect(() => {
    setLocalValue(form[itemProps.fieldName])
  }, [form]);

  const handleFocus = () => {
    if (mode === "config") {
      init(component);
    }
  };

  const handleChangeDate = (value) => {
    if (itemProps.fieldName) {
      if (itemProps.onlyDate) {
        formChange[itemProps.fieldName](value.format('YYYY-MM-DD'));
      } else {
        formChange[itemProps.fieldName](value.format());
      }
    }

    setLocalValue(value.format())
  };

  return (
    <Main onClick={handleFocus}>
      <div>
        {mode === 'editing' && !itemProps.disabled && (
          <DatePicker
            showTime={formatSecond.includes(itemProps.dateTimeFormat) ? { format: 'HH:mm:ss' } : null}
            allowClear={false}
            className={'date-picker'}
            onChange={handleChangeDate}
            value={localValue ? moment(localValue) : null}
            format={'DD/MM/YYYY'}
          />
        )}
      </div>

      <div className={'value-display'}>
        {render(itemProps.dateTimeFormat, localValue, mode)}
      </div>
    </Main>
  )
};

AppDatePicker.defaultProps = {
  form: {},
};

AppDatePicker.propTypes = {
  form: T.shape({})
};

const mapState = () => ({});

const mapDispatch = ({ component: { init } }) => ({
  init
});

export default connect(mapState, mapDispatch)(AppDatePicker);
