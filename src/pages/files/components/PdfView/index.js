import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Card, Button, Modal, Col, Row, Spin, Icon } from "antd";
import { useTranslation } from "react-i18next";
import HistorySigned from "../HistorySigned";
import { urltoFile } from "../../utils";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFModal = ({
  showModal,
  visible,
  urlFile,
  fileOnShow,
  fileData,
  signer,
  patientDocument,
  sign,
  initFileName,
}) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { fileSigned, fileName } = signer;

  const [urlSigned, setUrlSigned] = useState();
  const [urlFileLocal, setUrlFileLocal] = useState();
  const [active, setActiveFile] = useState(true);
  useEffect(() => {}, []);
  useEffect(() => {
    if (fileSigned) {
      const blob = new Blob([new Uint8Array(fileSigned)], {
        type: "application/pdf",
      });
      const blobUrl = window.URL.createObjectURL(blob);
      setUrlFileLocal(blobUrl);
    }
  }, [fileSigned]);

  useEffect(() => {
    setUrlFileLocal(urlFile);
  }, [urlFile]);

  const handleOk = () => {
    showModal(true);
  };

  const handleCancel = () => {
    showModal(false);
    setUrlFileLocal(null);
  };

  const handleSign = () => {
    if (urlFile) {
      const params = {
        formValue: fileOnShow.formValue,
        patientDocument: patientDocument,
        fileName: fileName || null,
        sequenceNo: 1,
        recordId: fileData.id,
      };
      urltoFile(urlFileLocal, "file.pdf", "application/pdf").then(function (
        file
      ) {
        sign({ ...params, file });
      });
    }
  };
  const viewPdfNew = () => {
    setUrlFileLocal(urlFile);
    initFileName(null);
    setUrlSigned(null);
    setActiveFile(true);
  };
  const handleActive = () => {
    setActiveFile(false);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const onDocumentComplete = (pages) => {
    setPageNumber(1);
    setNumPages(pages);
  };

  const onPageComplete = (page) => {
    setPageNumber(page);
  };

  const handlePrevious = () => {
    setPageNumber(pageNumber - 1);
  };

  const handleNext = () => {
    setPageNumber(pageNumber + 1);
  };

  const renderPagination = (pageNumber, pages) => {
    let previousButton = (
      <span className="previous" onClick={handlePrevious}>
        <Icon type="left" />
      </span>
    );
    if (pageNumber === 1) {
      previousButton = (
        <span className="previous disabled">
          <Icon type="left" />
        </span>
      );
    }
    let nextButton = (
      <span className="next" onClick={handleNext}>
        <Icon type="right" />
      </span>
    );
    if (pageNumber === pages) {
      nextButton = (
        <span className="next disabled">
          <Icon type="right" />
        </span>
      );
    }
    return (
      <div className="pager">
        {previousButton}
        {nextButton}
      </div>
    );
  };
  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      okText={t("drugDistributions.close")}
      cancelText={""}
      onCancel={handleCancel}
      style={{ minWidth: 1360}}
      bodyStyle={{ padding: 0 }}
      title={fileOnShow && fileOnShow.formName}
      footer={false}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Main>
        <Card bordered={false}>
          <Row>
            <Col span={4}></Col>
            <Col span={14}>
              <div className="pdf-view">
                <Spin spinning={!urlFileLocal}>
                  {/* <embed
                    id="pdfDocument"
                    type="application/pdf"
                    src={urlSigned || urlFile}
                  /> */}
                  <Document
                    file={urlFileLocal}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onDocumentComplete={onDocumentComplete}
                    onPageComplete={onPageComplete}
                    height={1150}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <div className="action">
                    <span className="page-description">
                      Trang {pageNumber} trong {numPages}
                    </span>
                    <span className="divider">|</span>
                    {renderPagination(pageNumber, numPages)}
                    <span className="divider-right">|</span>
                    <a
                      href={urlSigned || urlFile}
                      download="file.pdf"
                      className="download"
                    >
                      <Icon type="download" />
                    </a>
                  </div>
                </Spin>
              </div>
            </Col>
            <Col span={6}>
              <div className="sign-container">
                <h4 className="title-sign">Chữ ký người bệnh</h4>
                <Button
                  icon={"file-done"}
                  type={"primary"}
                  className={"item-btn text-btn"}
                >
                  {"Ký người bệnh"}
                </Button>
                <h4 className="title-sign">Chữ ký số</h4>
                <Button
                  icon={"file-done"}
                  type={"primary"}
                  className={"item-btn text-btn"}
                  disabled={fileData && !fileData.id}
                  onClick={handleSign}
                >
                  {"Kí số"}
                </Button>
                
              </div>

              <div className="history-list">
                <HistorySigned
                  fileOnShow={fileOnShow}
                  onActive={handleActive}
                  viewPdfNew={viewPdfNew}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Main>
    </Modal>
  );
};

const mapState = (state) => ({
  signer: state.signer,
});
const mapDispatch = ({ signer: { sign, initFileName } }) => ({
  sign,
  initFileName,
});

export default connect(mapState, mapDispatch)(PDFModal);
