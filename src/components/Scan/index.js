import React, { useEffect, useState } from "react";
import T from "prop-types";
import { connect } from "react-redux";
import { Table, Spin, Checkbox, Icon } from "antd";
import { isEmpty } from "lodash";
import { Main } from "./styled";
import Search from "./Search";
import PdfView from "pages/files/components/PdfView";
import { useTranslation } from "react-i18next";
import Pagination from 'components/Pagination';

const ScanMedicalRecord = ({ isLoadingDoccumentScan, medicalRecordScan , fileScan, getFileScan}) => {
  const { t } = useTranslation();
  const { Column } = Table;
  const [scanPagination, setScanPagination] = useState([]);
  const [isShowPDF, setShowPDF] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [urlLocal, setUrlFileLocal ] = useState();
  const [fileOnShow, setFileOnShow ] = useState();
  const [fileData, setFileData ] = useState();
  const [visible, setVisible] = useState()
  const [patientDocument, setPatientDocument ] = useState();

  useEffect(() => {
    pagination();
  }, [medicalRecordScan]);

  useEffect(()=> {
    if (fileScan) {
      const blob = new Blob([new Uint8Array(fileScan)], {
        type: "application/pdf",
      });
      const blobUrl = window.URL.createObjectURL(blob);
      setUrlFileLocal(blobUrl);
    }
  }, [fileScan])
  const pagination = () => {
    const scanLocals = !isEmpty(medicalRecordScan)
      ? medicalRecordScan.slice(0, 10)
      : [];

    setScanPagination(scanLocals);
  };

  const onChangePage = (current) => {
    const list = medicalRecordScan.slice(
      (current - 1) * pageSize,
      (current - 1) * pageSize + pageSize
    );
    setScanPagination(list);
    setCurrentPage(current);
  };

  const selectRow = (item) => {
    showPDF(true)
    const fileShow = {
      formValue: item.formValue,
      formName: item.formName
    }
    setFileOnShow(fileShow)
    setPatientDocument(item.patientDocument)
    setFileData({id: item.recordId})
    getFileScan(item.filePath)
  };

  const onShowSizeChange = (current, size) => {
    const scanLocals = !isEmpty(medicalRecordScan)
      ? medicalRecordScan.slice(
          (current - 1) * size,
          (current - 1) * size + size
        )
      : [];

    setScanPagination(scanLocals);
    setPageSize(size);
    setCurrentPage(current);
  };
  const showPDF = (type) => {
    setShowPDF(type)
  };
  return (
    <Main>
      <Search />
      <Spin spinning={isLoadingDoccumentScan}>
        <div className="patient-list">
          <Table dataSource={scanPagination} rowKey="id" pagination={false}>
            <Column
              title={"STT"}
              key="index"
              render={(value, item, index) => (
                <span>{`${(currentPage - 1) * pageSize + index + 1}`}</span>
              )}
            />
            <Column title={"Mã hồ sơ"} dataIndex="formValue" key="formValue" />
            <Column
              title={"Họ và tên"}
              dataIndex="patientHistory.patientName"
              key="patientHistory.patientName"
            />
            <Column title={"Biểu mẫu"} dataIndex="formName" key="formName" />
            <Column title={"Lần scan"} dataIndex="times" key="times" />

            <Column
              title={"Ngày sinh"}
              dataIndex="patientHistory.birthday"
              key="patientHistory.birthday"
            />
            <Column
              title={"Giới tính"}
              align="center"
              render={(text, record) => (
                <span>{record.patientHistory.gender === 1 ? "Nam" : "Nữ"}</span>
              )}
            />
            <Column
              title={"Địa chỉ"}
              dataIndex="patientHistory.address"
              key="patientHistory.address"
            />
            <Column
              title={"Xem"}
              render={(text, record) => (
                <div className="action">
                  <Icon
                    type="eye"
                    onClick={() => selectRow(record)}
                    style={{ color: "#08AAA8" }}
                  />
                </div>
              )}
            />
            <Column
              title={"Có hiệu lực"}
              align="center"
              render={(text, record) => <Checkbox checked={record.active} />}
            />
          </Table>

          <Pagination
            current={currentPage}
            className={"patient-paging"}
            total={medicalRecordScan.length}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} bản ghi`
            }
            showQuickJumper
            showSizeChanger
          />
          <PdfView
            visible={isShowPDF}
            showModal={showPDF}
            urlFile={urlLocal}
            fileOnShow={fileOnShow}
            fileData={fileData}
            patientDocument={patientDocument}
          />
        </div>
      </Spin>
    </Main>
  );
};

ScanMedicalRecord.defaultProps = {
  medicalRecordScan: [],
};

ScanMedicalRecord.propTypes = {
  medicalRecordScan: T.array,
};

const mapState = (state) => ({
  isLoadingDoccumentScan: state.scan.isLoadingDoccumentScan,
  medicalRecordScan: state.scan.medicalRecordScan,
  fileScan: state.scan.fileScan
});

const mapDispatch = ({
  vitalSigns: { getAllCategory },
  department: { getAllDepartments },
  scan: { getFileScan}
}) => ({
  getAllCategory,
  getAllDepartments,
  getFileScan
});

export default connect(mapState, mapDispatch)(ScanMedicalRecord);
