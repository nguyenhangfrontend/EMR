import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Spin } from "antd";
import File from "components/File";
import Toolbar from "./components/Toolbar";
import FormList from "./components/FormList"
import { Main } from "./styled";

const Files = ({
  files,
  getPatientDocument,
  patient,
  updateLoad,
  getJson,
  getFileData,
  getFileDataHIS,
  getOne,
  documents,
  fetchTemplate,
  fetchFiles,
  deleteFile,
  updatePatientDocument,
}) => {
  const [isVisible, setVisible] = useState(false);
  const [fileOnShow, setFileOnShow] = useState({});
  const params = useParams();
  const history = useHistory();
  const fileRef = useRef(null);
  const formListRef = useRef(null);

  const url = new URL(window.location.href);
  const formsStr = url.searchParams.get("files");
  const recordId = url.searchParams.get("recordId");
  const { fileTemplate, file } = files;

  useEffect(() => {
    const patientDocument = params.patientDocument;

    updatePatientDocument(patientDocument);
    fetchTemplate(patientDocument);
    fetchFiles(patientDocument);
  }, [params.patientDocument]);

  useEffect(() => {
    const objF = documents.files.find((item) => item.formId === parseInt(formsStr));

    if (objF) {
      changeFile(objF);
      formListRef.current.setExpandedKeys(formsStr.split(','));

      if (recordId) {
        formListRef.current.setSelectedKeys([`${formsStr.split(',')[0]}_${recordId}`])
      } else {
        if (documents.files.filter(item => item.formId === parseInt(formsStr)).length < 2) {
          formListRef.current.setSelectedKeys(formsStr.split(','))
        }
      }

    } else {
      changeFile(documents.files[0] || {});
    }
  }, [documents.files]);

  useEffect(() => {
    if (fileOnShow.formId) {
      getOne(fileOnShow.formId);
      handleLoadInfo(fileOnShow);

      if (fileOnShow.nbHoSoBaId) {
        history.push(`${history.location.pathname}?files=${fileOnShow.formId}&recordId=${fileOnShow.nbHoSoBaId}`);
      } else {
        history.push(`${history.location.pathname}?files=${fileOnShow.formId}`);
      }

    }
  }, [fileOnShow]);

  const changeFile = (file) => {
    setFileOnShow(file);
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleLoadInfo = (file) => {

    getJson(file.api);
    getFileData({ file, patientDocument: params.patientDocument, recordId: file.nbHoSoBaId });
    getFileDataHIS({ file, patientDocument: params.patientDocument });
  };

  const saveData = () => {
    if (fileRef.current) {
      fileRef.current.handleSubmit();
    }
  };

  const handleRemoveFile = (file) => {
    deleteFile({
      api: file.api,
      recordId: file['nbHoSoBaId'],
      patientDocument: params.patientDocument,
    })
  };

  return (
    <Main>
      <div className="layout-body">
        <div className="layout-middle">
          <Toolbar
            handleOpen={handleOpen}
            fileOnShow={fileOnShow}
            saveData={saveData}
            handleLoadInfo={handleLoadInfo}
            changeFile={changeFile}
            saveStatus={files.loading}
            fileData={files.data}
            patientDocument={params.patientDocument}
            list={documents.files}
          />

          <div className={"editing-contain"} id={'main-contain'}>
            <FormList
              ref={formListRef}
              isVisible={isVisible}
              fileOnShow={fileOnShow}
              handleCloseForm={handleClose}
              changeFile={changeFile}
              list={documents.files}
              template={documents.template}
              templateName={documents.templateName}
              removeFile={handleRemoveFile}
            />

            <div className={"editing-box"} id="scrollBox">
              <Spin spinning={files.dataLoading || files.filesLoading}>
                <div className={"form-content"} id={'file-data-display'}>
                  <File
                    updateLoad={updateLoad}
                    ref={fileRef}
                    file={file}
                    fileTemplate={fileTemplate}
                    fileData={files.data}
                    fileDataHIS={files.dataHIS}
                    json={files.json}
                  />
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

const mapState = (state) => ({
  files: state.files,
  patient: state.patient,
  documents: state.documents,
});

const mapDispatch = ({
  files: {
    updateLoad,
    getJson,
    getFileData,
    getFileDataHIS,
    getOne,
  },
  patient: { getPatientDocument, updatePatientDocument },
  documents: { fetchTemplate, fetchFiles, deleteFile }
}) => ({
  getPatientDocument,
  updateLoad,
  getJson,
  getFileData,
  getFileDataHIS,
  getOne,
  fetchTemplate,
  fetchFiles,
  deleteFile,
  updatePatientDocument,
});

export default connect(mapState, mapDispatch)(Files);
