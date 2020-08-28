import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { VitalSigns } from "./components";
import { Spin } from "antd";
import { useParams } from "react-router-dom";

const VitalSignsMain = (props) => {
  const params = useParams();
  const patientDocument = params.patientDocument;

  useEffect(() => {
    props.getDataVitalSigns(patientDocument);
    props.getAllVitalSignsCategory();
    props.updatePatientDocument(patientDocument);

    return () => {
      props.updateData({ values: null, moreValueIds: null });
    };
  }, []);

  return (
    <Main>
      <div className="layout-body">
        <div className="layout-middle">
          <Spin spinning={props.isLoading}>
            <VitalSigns />
          </Spin>
        </div>
      </div>
    </Main>
  );
};

const mapState = (state) => ({
  isLoading: state.vitalSigns.isLoading,
});

const mapDispatch = ({
  vitalSigns: { getDataVitalSigns, getAllVitalSignsCategory, updateData },
  patient: { updatePatientDocument }
}) => ({
  getDataVitalSigns,
  getAllVitalSignsCategory,
  updateData,
  updatePatientDocument,
});

export default connect(mapState, mapDispatch)(VitalSignsMain);
