import React, { useEffect, useState } from "react";
import { Drawer, List, Avatar, Tree, Icon } from "antd";
import moment from "moment";
import { Main } from "./styled";
import { connect } from "react-redux";
const { TreeNode } = Tree;
const FormList = ({
  historySigned,
  getHistorySigned,
  data,
  patientId,
  fileOnShow,
  loadFileSigned,
  fileSigned,
  initFileName,
  onActive,
  viewPdfNew,
}) => {
  const [listLocal, setList] = useState([]);

  useEffect(() => {
    const params = {
      formId: fileOnShow.id,
      patientHistoryId: patientId,
      recordId: data.id,
    };

    getHistorySigned(params);
  }, [fileOnShow, data, patientId, fileSigned]);

  const viewPdfSigned = (item) => {
    loadFileSigned(item[0].signedFilePath);
    initFileName(item[0].fileName);
    onActive(false);
  };

  return (
    <Main>
      <h4 className="title-history">Lịch sử kí</h4>
      <Tree
        switcherIcon={<Icon type="down" />}
        showIcon={false}
        autoExpandParent={true}
      >
        <TreeNode
          className="new-item"
          title={
            <div onClick={viewPdfNew} className="item-child">
              <span className="user">{fileOnShow.formName} </span>
              <p className="date">
                {moment().format("hh:mm - DD/MM/YYYY")}
                <span className="type">
                 - Chưa ký
                </span>
              </p>
            </div>
          }
          key={"0-0"}
        />

        {historySigned.length > 0 &&
          historySigned.map((item, index) => {
            return (
              <TreeNode
                title={
                  <div
                    className="item-child"
                    onClick={() => viewPdfSigned(item)}
                  >
                    <span className="user">{item[0].formName} </span>
                    <p className="date">
                      {moment(item[0].actDate).format("hh:mm - DD/MM/YYYY")}
                    </p>
                  </div>
                }
                key={index}
              >
                {item.length > 0 &&
                  item.map((child) => {
                    return (
                      <TreeNode
                        title={
                          <div
                            className="item-child"
                            onClick={() => viewPdfSigned(item)}
                          >
                            <span className="date">
                              {moment(child.actDate).format(
                                "hh:mm - DD/MM/YYYY"
                              )}
                            </span>
                            <span className="user"> - {child.username} - </span>
                            <span className="type">
                              {child.type === 1 ? "Kí ĐT" : "kí số"}
                            </span>
                          </div>
                        }
                        key={child.id}
                      />
                    );
                  })}
              </TreeNode>
            );
          })}
      </Tree>
    </Main>
  );
};

const mapState = (state) => ({
  historySigned: state.signer.historySigned,
  patientId: state.patient.info.id || null,
  data: state.files.data,
  fileSigned: state.signer.fileSigned,
});
const mapDispatch = ({
  signer: { getHistorySigned, loadFileSigned, initFileName },
}) => ({
  getHistorySigned,
  loadFileSigned,
  initFileName,
});
export default connect(mapState, mapDispatch)(FormList);
