import React, { useState } from 'react';
import { Dropdown, Icon, Row, Col } from 'antd';
import { Main, Color, ColorItem, ColorContain } from './styled';
import { colors } from '../constants';

const color = (handleSetColor) => (
  <ColorContain>
    <Row gutter={[6, 6]}>
      {colors.map(key => (
        <Col span={8} key={key}>
          <ColorItem onClick={handleSetColor(key)} color={key} />
        </Col>
      ))}
    </Row>
  </ColorContain>
);

const PickColor = ({ icon, changeColor }) => {
  const [value, setColor] = useState(colors[1]);
  
  const handleSetColor = (res) => () => {
    setColor(res);
    changeColor(res);
  };
  
  const handleClick = () => {
    changeColor(value);
  };
  
  return (
    <Main>
      <Dropdown.Button
        placement="bottomCenter"
        overlay={color(handleSetColor)}
        size={'small'}
        icon={<Color color={value} />}
        trigger={['click']}
        onClick={handleClick}
      >
        <Icon type={icon} style={{ color: value }} />
      </Dropdown.Button>
    </Main>
  )
};

export default PickColor;
