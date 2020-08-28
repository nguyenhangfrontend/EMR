import React, { memo, useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import T from 'prop-types';
import moment from 'moment';
import { Button } from 'antd';
import { Main } from './styled';
import Block from 'components/Config/Block';
import Resizeable from 'components/Config/Block/Resizeable';

const Line = forwardRef((props, ref) => {
  const { line, removeLine, components, updateComponents,
    width, mode, values, valuesHIS,  formChange, insertLine, formId, minHeight, verticalLine,
  } = props;
  const [localLine, setLocalLine] = useState({ items: [] });
  const [localComponents, setLocalComponents] = useState([]);
  const [focusing, setFocusing] = useState(false);
  const lineRef = useRef();
  const arrayRef = useRef([]);

  useEffect(() => {}, []);
  
  useEffect(() => {
    setLocalComponents(components);
  }, [components]);
  
  useEffect(() => {
    lineRef.current = localLine;
  }, [localLine]);
  
  useEffect(() => {
    setLocalLine(line);
  }, [line]);
  
  const combineData = () => ({
    ...localLine,
    items: localLine.items.map((item, index) => arrayRef.current[`item_${index}`] ?
      arrayRef.current[`item_${index}`].collect().item : {}),
    components: localLine.items.reduce((res, next, index) => {
      const arr = arrayRef.current[`item_${index}`] ? [
        arrayRef.current[`item_${index}`].collect().component,
          ...arrayRef.current[`item_${index}`].collect().components
        ] : [];

      return [...res, ...arr];
    }, [])
  });
  
  useImperativeHandle(ref, () => ({
    collect: () => combineData(),
  }));
  
  const handleInsertLine = () => {
    insertLine();
  };
  
  const resizeable = (currentItem, nextItem) => {
    const listItem = lineRef.current.items;
    
    const items = listItem.map(item => {
      if (item.key === currentItem.key) {
        return currentItem;
      }
      
      if (item.key === nextItem.key) {
        return nextItem;
      }
      
      return item;
    });
  
    setLocalLine({ ...lineRef.current, items });
  };
  
  const addBlock = () => {
    const block = {
      width: width/(localLine.items.length + 1),
      parent: line.key,
      key: moment().valueOf(),
    };
    
    const items = localLine.items.map(item => ({ ...item, width: width/(localLine.items.length + 1) }));
  
    setLocalComponents(components.map(c => ({ ...c, width: block.width })));
    setLocalLine({...localLine, items: [...items, block] })
  };
  
  const remove = () => {
    removeLine(line);
  };
  
  const handleFocus = () => {
    setFocusing(true);
  };
  
  const handleLeave = () => {
    setFocusing(false);
  };
  
  return (
    <Main
      mode={mode}
      minHeight={minHeight}
      className={'layout-line-item'}
    >
      {mode === 'config' ? (
        <div
          className={'line-style'}
          onMouseMove={handleFocus}
          onMouseLeave={handleLeave}
        >
          {localLine.items.map((item, index) => (
            <Block
              ref={ref => {
                arrayRef.current[`item_${index}`] = ref;
              }}
              key={item.key}
              item={item}
              mode={mode}
              resizeable={resizeable}
              component={localComponents.find(c => c.parent === item.key)}
              updateComponents={updateComponents}
              formId={formId}
              verticalLine={verticalLine}
            >
              {index !== (localLine.items.length - 1) && (
                <Resizeable
                  verticalLine={verticalLine}
                  resizeable={resizeable}
                  currentItemProps={item}
                  nextItemProps={localLine.items[index + 1]}
                />
              )}
            </Block>
          ))}

          {focusing && (
            <div className={'line-action'}>
              <Button.Group>
                <Button icon={'pause'} size={'small'} onClick={addBlock} />
                <Button icon={'vertical-align-top'} size={'small'} onClick={handleInsertLine} />
                <Button icon={'close'} size={'small'} onClick={remove} />
              </Button.Group>
            </div>
          )}
        </div>
      ) : (
        <div className={'line-style'}>
          {localLine.items.map((item) => (
            <Block
              key={item.key}
              item={item}
              mode={mode}
              component={localComponents.find(c => c.parent === item.key)}
              values={values}
              valuesHIS={valuesHIS}
              formChange={formChange}
              formId={formId}
            />
          ))}

          {mode === 'config' && focusing && (
            <div className={'line-action'}>
              <Button.Group>
                <Button icon={'pause'} size={'small'} onClick={addBlock} />
                <Button icon={'vertical-align-top'} size={'small'} onClick={handleInsertLine} />
                <Button icon={'close'} size={'small'} onClick={remove} />
              </Button.Group>
            </div>
          )}
        </div>
      )}
    </Main>
  );
});

Line.defaultProps = {
  components: [],
  focusing: false,
  line: {},
  block: {},
  updateLine: () => {},
  focusLine: () => {},
};

Line.propTypes = {
  components: T.arrayOf(T.shape({})),
  focusing: T.bool,
  line: T.shape({}),
  block: T.shape({}),
  updateLine: T.func,
  focusLine: T.func,
};

export default memo(Line);
