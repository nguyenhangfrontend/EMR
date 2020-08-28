import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Main } from "./styled";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import ScanArea from "assets/svg/scanarea.svg";
import ButtonClose from "assets/svg/camera-close.svg";
function ScanQrCode(props, ref) {
  const refCallback = useRef(null);
  const [state, _setState] = useState({});
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };

  useImperativeHandle(ref, () => ({
    show: (callback) => {
      setState({
        show: true,
      });
      refCallback.current = callback;
    },
  }));

  const handleScan = (data) => {
    if (data) {
      if (props.onOK) {
        props.onOK(data);
      }
      setState({ show: false });
      if (refCallback.current) refCallback.current(data);
    }
  };
  const handleError = (err) => {};
  const onCancel = () => {
    setState({ show: false });
  };

  return (
    <Main
      visible={state.show}
      footer={null}
      onCancel={onCancel}
      closable={false}
    >
      <ScanArea className="scan-area" width={150} height={150} />
      {state.show && (
        <BarcodeScannerComponent
          style={{ width: "100%" }}
          onUpdate={(err, result) => {
            if (result) handleScan(result.text);
            else handleError("Not Found");
          }}
        />
      )}
      <div className="camera-footer">
        <span className="tip">Di chuyển Camera đến khu vực cần quét</span>
        <ButtonClose width={40} height={40} className="button-close" onClick={onCancel}/>
      </div>
    </Main>
  );
}

export default forwardRef(ScanQrCode);
