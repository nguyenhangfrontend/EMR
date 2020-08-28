import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { connect } from 'react-redux';
import Grid from './Grid';
import { FORM_WIDTH } from 'components/constanst';
import { fontSizes } from 'components/EditorTool/Text/constants';
import { Main, Content } from './styled'
import VerticalLine from 'components/Config/VerticalLine';

const DocumentConfig = forwardRef((props, ref) => {
  const { config, addLine, removeLine, updateLine, focusLine, focusBlock, updateComponents } = props;
  const gridRef = useRef(null);
  const verticalLineRef = useRef(null);
  const { line, lines, block, components } = config;
  const fontSize = config.props.fontSize ? fontSizes[config.props.fontSize] : '12';
  
  const handleCollect = () => {
    if (gridRef.current) {
      return gridRef.current.collect();
    }
    
    return [];
  };
  
  useImperativeHandle(ref, () => ({
    collect: handleCollect
  }));

  return (
    <Main fontSize={fontSize}>
      <div className="creation-contain">

        <Content id="content">
          <VerticalLine ref={verticalLineRef} />

          <Grid
            verticalLine={verticalLineRef}
            ref={gridRef}
            width={FORM_WIDTH}
            addLine={addLine}
            removeLine={removeLine}
            line={line}
            block={block}
            lines={lines}
            updateLine={updateLine}
            focusLine={focusLine}
            focusBlock={focusBlock}
            components={components}
            updateComponents={updateComponents}
            mode={'config'}
            fontSize={fontSize}
          />
        </Content>
      </div>
    </Main>
  );
});

const mapState = state => ({
  config: state.config,
});

const mapDispatch = ({ config: {
  addLine,
  removeLine,
  updateLine,
  focusLine,
  focusBlock,
  updateComponents,
} }) => ({
  addLine,
  removeLine,
  updateLine,
  focusLine,
  focusBlock,
  updateComponents,
});

export default connect(mapState, mapDispatch, null, { forwardRef: true })(DocumentConfig);
