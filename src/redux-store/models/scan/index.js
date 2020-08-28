import { client, scanPath } from "client/request";
import { combineUrlParams } from "utils";
import { DOCUMENTS_SCAN, FILE_SCAN } from "client/api";

export default {
  state: {
    medicalRecordScan: [],
    isLoadingDoccumentScan: false,
    fileScan: ''
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    
    initMedicalRecordScan(state, payload) {
      return { ...state, medicalRecordScan: payload };
    },
    setLoadingDoccumentScan(state, payload) {
      return { ...state, isLoadingDoccumentScan: payload };
    },
    setFileScan(state, payload) {
      return { ...state, fileScan: payload };
    },
  },

  

  effects: (dispatch) => ({
    async getMedicalRecordScan(payload) {
      dispatch.scan.setLoadingDoccumentScan(true)
      
      const res = await client.get(
        combineUrlParams(`${scanPath}${DOCUMENTS_SCAN}`, {
          page: "0",
          size: 1000,
          ...payload,
        })
      );
      dispatch.scan.initMedicalRecordScan(res.data.data || []);
      dispatch.scan.setLoadingDoccumentScan(false)
    },
    async uploadScan(payload, rootState) {

      const data = {
        patientDocument: payload.patientDocument,
        formValue: payload.formValue,
        recordId:  payload.recordId,
      }

      const dataForm = new FormData();
      dataForm.append("file", payload.file);

      for (const name in payload.file) {
        dataForm.append(name, payload.file[name]);
      }
      for (const name in data) {
        dataForm.append(name, data[name]);
      }
      dataForm.append("user", "hubot");
     
      const response = await client.post(`${scanPath}${DOCUMENTS_SCAN}`, dataForm, {
        headers: { "Content-Type": undefined },
      });
      
    },

    async getFileScan(payload, rootState) {
      const res = await client.get(`${scanPath}${FILE_SCAN}/${payload}`, {
        responseType: "arraybuffer",
      });
      dispatch.scan.setFileScan(res.data);
    },
  }),
};
