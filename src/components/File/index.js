import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import T from "prop-types";
import Grid from "components/Config/Grid";
import { convert } from "./constants";
import { fontSizes } from 'components/EditorTool/Text/constants';
import { Main } from "./styled";

const File = forwardRef((props, ref) => {
  const { file, fileData, fileDataHIS, json, updateLoad, mode, fileTemplate } = props;
  const [values, setValues] = useState({});
  const [defaultValue, setDefaultValue] = useState({});
  const [HISValue, setHISValue] = useState({});
  const [formChange, setFormChange] = useState({});
  const [changed, setChanged] = useState(false);
  const prevCountRef = useRef();
  const fontSize = file.config ? fontSizes[file.config.fontSize] : 12;

  useEffect(() => {
    prevCountRef.current = values;
  });

  const handleSubmit = () => {
    const data = convert({ ...values });

    updateLoad({ ...data, api: file.api, fileId: file.id, formId: file.id });
  };

  useImperativeHandle(ref, () => ({
    values: values,
    handleSubmit
  }));

  const setFormKey = key => value => {
    const prevValues = prevCountRef.current;
    const newForm = { ...prevValues, [key]: value };

    if (!changed) {
      setChanged(true);
    }

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
    if (!fileData.patientDocument && fileDataHIS.patientDocument) {
      setValues(fileDataHIS);
      setDefaultValue(fileDataHIS);
    } else {
      setDefaultValue(fileData);
      setValues(fileData);
    }

    setHISValue(fileDataHIS);
  }, [fileData, fileDataHIS]);
  
  return (
    <Main fontSize={fontSize}>
      <Grid
        fileTemplate={fileTemplate}
        formChange={formChange}
        values={defaultValue}
        valuesHIS={HISValue}
        formId={file.id}
        lines={file.layout}
        components={file.components}
        mode={mode || "editing"}
        fontSize={fontSize}
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

export default File;
