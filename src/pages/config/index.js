import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin, Button, Tabs } from 'antd';
import Properties from 'components/Config/ComponentProperties';
import Config from 'components/Config';
import Text from 'components/EditorTool/Text';
import FormProperties from 'components/Config/FormProperties';
import { Main } from './styled';

const Layout = ({ getById, config, updateForm }) => {
  const configRef = useRef(null);
  const propRef = useRef(null);
  const params = useParams();
  
  useEffect(() => {
    if (params.formId) {
      getById(params.formId);
    }
  }, [params.formId]);
  
  const handleSubmit = () => {
    if (params.formId) {
      updateForm({
        id: params.formId,
        ...configRef.current.collect(),
        properties: propRef.current.collectProps()
      });
    }
  };
  
  return (
    <Main>
      <div className="layout-body">
        <div className="layout-middle">
          <Spin spinning={config.loading}>
            <Config ref={configRef} />
          </Spin>
        </div>
        <div className={"layout-right-side"}>
          <Text />

          <Tabs>
            <Tabs.TabPane key={'com'} tab={'Com props'}>
              <Properties ref={propRef} handleSubmit={handleSubmit} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'form'} tab={'Form props'}>
              <FormProperties />
            </Tabs.TabPane>
          </Tabs>
          
          <div style={{ padding: '0 12px'}}>
            <Button block type={'primary'} onClick={handleSubmit}>{'Save'}</Button>
          </div>
        </div>
      </div>
    </Main>
  );
};

const mapState = (state) => ({
  config: state.config,
});

const mapDispatch = ({ config: { getById, updateForm } }) => ({ getById, updateForm });

export default connect(mapState, mapDispatch)(Layout);
