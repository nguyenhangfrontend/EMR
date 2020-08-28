import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Input, Button, Row, Col, Card, Icon, message } from 'antd';
import { Main } from './styled';
import CreateModal from 'components/Config/CreateModal';
import { unsignText } from 'components/utils';

const Documents = ({ fetchDocument, listing }) => {
  const params = useParams();
  const refDropdown = useRef(null);
  const [listSearch, setListSearch] = useState([]);
  const [onShow, setOnShow] = useState(false);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchDocument();
  }, []);
  
  useEffect(() => {
    setListSearch(listing.list)
  }, [listing]);
  
  const onSearch = e => {
    let event = e.target.value;
    let list = listing.list;
    
    if (event) {
      event = unsignText(event).toLocaleLowerCase();
      list = (listing.list || []).filter(item => {
        return (
          unsignText(item.name
            .toLocaleLowerCase()).includes(event) ||
          item.value
            .toLocaleLowerCase()
            .includes(event)
        );
      });
    }
    
    setListSearch(JSON.parse(JSON.stringify(list)));
    setPage(1)
  };
  
  const handleShowCreate = () => {
    setOnShow(true);
  };
  
  const handleHideCreate = () => {
    setOnShow(false);
  };

  const handleCreateDocument = () => {
    message.warning('This feature has developed!')
  };

  const onScroll = (e) => {
    let element = e.target;
    if (parseInt(element.scrollHeight) - parseInt(element.scrollTop) === parseInt(element.clientHeight)) {
      if (page * 12 < listSearch.length) {
        setPage(page + 1)
      }
    }
  };
  
  return (
    <Main>
      <Row gutter={[24, 12]}>
        <Col span={16}>
          <Card title={'Documents'} size={'small'}>
            <div className={'header-action'}>
              <Input.Search
                onChange={onSearch}
                className={'search-box'}
                placeholder="Tìm Kiếm"
              />
            </div>

            <div className="scroll-container mostly-customized-scrollbar" ref={refDropdown} onScroll={onScroll}>
              <Menu defaultSelectedKeys={[params.formId || '']}>
                {listSearch.filter((item, index) => index < (page * 12)).map(item => {
                  return (
                    <Menu.Item key={item.id} className={'form-item'}>
                      <Link to={`/config/${item.id}`} title={item.name}>
                        <span>{item.name}</span>
                      </Link>
                    </Menu.Item>
                  );
                })}
              </Menu>
            </div>
          </Card>
        </Col>

        <Col span={4}>
            <Button
              type={'dashed'}
              onClick={handleShowCreate}
              style={{ height: 240 }}
              block
            >
              <Icon type={'file-add'} style={{ fontSize: 42, marginBottom: 12 }} />
              <div style={{ fontSize: 16 }}>{'Add file'}</div>
            </Button>
        </Col>


        <Col span={4}>
          <Button
            type={'dashed'}
            onClick={handleCreateDocument}
            style={{ height: 240 }}
            block
          >
            <Icon type={'folder-add'} style={{ fontSize: 42, marginBottom: 12 }} />
            <div style={{ fontSize: 16 }}>{'Create document'}</div>
          </Button>
        </Col>
      </Row>

      
      <CreateModal onShow={onShow} handleHideModal={handleHideCreate} />
    </Main>
  );
};

const mapState = (state) => ({
  listing: state.listing,
});

const mapDispatch = ({ listing: { fetchDocument } }) => ({ fetchDocument });

export default connect(mapState, mapDispatch)(Documents);
