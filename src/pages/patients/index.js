import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { List, Card, Icon, Avatar } from "antd";
import { isEmpty } from "lodash";
import { Main } from "./styled";
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import SearchPatient from 'components/SearchPatient';
import Pagination from 'components/Pagination';

const PatientList = ({ patient, select, url, updatePatientDocument, fetPatients }) => {
  const history = useHistory();
  const { inPatienList, loadingInpatients } = patient;
  const [patientsPagination, setPatients] = useState([]);
  const [selectedIdx, setSelectedId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const params = useParams();

  useEffect(() => {
    fetPatients()
  }, []);

  useEffect(() => {
    pagination();
    if (params.patientDocument) {
      const obj = inPatienList.find(p => p.maHoSo === params.patientDocument) || {};

      setSelectedId(obj.id);
    } else {
      if (inPatienList.length > 0) {
        setSelectedId(inPatienList[0].id);
        select(inPatienList[0]);
      }
    }
  }, [inPatienList]);

  useEffect(() => {
    updatePatientDocument(params.patientDocument);
  }, [params.patientDocument]);

  const pagination = () => {
    const patientLocals = !isEmpty(inPatienList)
      ? inPatienList.slice(0, 10)
      : [];

    setPatients(patientLocals);
  };

  const onChangePage = (current) => {
    const list = inPatienList.slice((current - 1)*pageSize, (current - 1)*pageSize + pageSize);
    setPatients(list);
    setCurrentPage(current);
  };

  const selectRow = (item) => () => {
    setSelectedId(item.id);
    select(item)
  };

  const selectPatient = (item) => () => {
    let link = url.split('/');
    link.pop();
    link = link.join("/");
    select(item);
    history.push(`${link}/${item.maHoSo}`);
  };

  const onShowSizeChange = (current = 1, size) => {
    const patientLocals = !isEmpty(inPatienList)
      ? inPatienList.slice((current - 1)*size, (current - 1)*size + size)
      : [];

    setPatients(patientLocals);
    setPageSize(size);
    setCurrentPage(current);
  };

  return (
    <Main>
      <Card bordered={false} size={'small'}>
        <h4 className="title-list">{t('patient.list')}</h4>
        <SearchPatient />

        <List
          size={'small'}
          itemLayout="horizontal"
          dataSource={patientsPagination}
          loading={loadingInpatients}
          className={'patient-list'}
          renderItem={(item, index) => (
            <List.Item
              onClick={selectRow(item)}
              onDoubleClick={selectPatient(item)}
              actions={[<Icon type={'more'} />]}
              className={`patient-item ${selectedIdx === item.id ? 'selected-item' : ''}`}
            >
              <List.Item.Meta
                avatar={<Avatar icon={'user'} />}
                title={
                  <span>
                    <span className={'item-num'}>{`${(currentPage-1)*pageSize + index + 1}. `}</span>
                    {item['tenNb']}

                    <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontWeight: 400, fontSize: 13 }}>
                      {` - Giới tính: ${item['gioiTinh']}, ${item['tuoi']} tuổi`}
                    </span>
                  </span>
                }
                description={(
                  <div>
                    <span>
                      {`${item.phong !== null ? item.phong : ""}`}
                      {`- Giường ${item.giuong !== null ? item.giuong : ""}`}
                    </span>
                  </div>
                )}
              />

              <div style={{ width: 300 }}>
                <div>
                  <span>{'Mã HS: '}</span>
                  <span style={{ fontWeight: 600 }}>{item['maHoSo']}</span>
                </div>
                <div>
                  <span>{'Mã BA: '}</span>
                  <span style={{ fontWeight: 600 }}>{item['maBenhAn']}</span>
                </div>
              </div>
            </List.Item>
          )}
        />

        <Pagination
          current={currentPage}
          total={inPatienList.length}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </Card>
    </Main>
  );
};

const mapState = (state) => ({
  common: state.common,
  patient: state.patient,
  patientHistory: state.patient.patientHistory,
  url: state.treatment.url
});

const mapDispatch = ({ patient: {  select, updatePatientDocument, fetPatients } }) => ({
  select,
  updatePatientDocument,
  fetPatients,
});

export default connect(mapState, mapDispatch)(PatientList);
