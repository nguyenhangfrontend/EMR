import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import T from "prop-types";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import Grid from "components/Config/Grid";
import { convert } from "./constants";
import { fontSizes } from 'components/EditorTool/Text/constants';
import { Main } from "./styled";

const File = forwardRef((props, ref) => {
  const { file, getJson, fileData, getFileData, json, updateLoad } = props;
  const [values, setValues] = useState({});
  const [defaultValue, setDefaultValue] = useState({});
  const [formChange, setFormChange] = useState({});
  const params = useParams();
  const prevCountRef = useRef();
  const fontSize = file.config ? fontSizes[file.config.fontSize] : '12';

  useEffect(() => {
    prevCountRef.current = values;
  });

  const handleSubmit = () => {
    const data = convert({ ...values });
    updateLoad({ ...data, api: file.api, fileId: file.id });
  };

  useImperativeHandle(ref, () => ({
    values: values,
    handleSubmit
  }));

  const setFormKey = key => value => {
    const prevValues = prevCountRef.current;

    const newForm = { ...prevValues, [key]: value };

    setValues(newForm);
  };

  useEffect(() => {
    const obj = json.reduce(
      (res, key) => ({
        ...res,
        [key]: setFormKey(key)
      }),
      {}
    );

    setFormChange(obj);
  }, [json]);

  useEffect(() => {
    getJson(file.api);
    getFileData({ file, patientDocument: params.patientDocument });
  }, [file, getFileData, getJson, params.patientDocument]);

  useEffect(() => {
    setDefaultValue({
      ...fileData
    });
    setValues({ ...fileData });
  }, [fileData]);
  
  return (
    <Main fontSize={fontSize}>
      <Grid
        formChange={formChange}
        values={defaultValue}
        formId={file.id}
        lines={file.layout}
        components={file.components}
        mode={"editing"}
      />
    </Main>
  );
});

File.defaultProps = {
  fileData: {},
  patientInfo: {}
};

File.propTypes = {
  fileData: T.shape({}),
  patientInfo: T.shape({})
};

const mapState = state => ({
  files: state.files
});

const mapDispatch = ({ files: { getJson, getFileData } }) => ({
  getJson,
  getFileData
});

export default connect(mapState, mapDispatch, null, { forwardRef: true })(File);
