import { client, dataPath, patientPath } from 'client/request';
import { isArray } from 'lodash';
import { PATIENT_HISTORIES, INPATIENT_LIST, AVATAR} from 'client/api';
import { combineUrlParams } from 'utils';
import { message } from "antd";
export default {
  state: {
    loading: false,
    patient: {},
    list: [],
    info: {},
    patientDocument: null,
    patientHistory: {},
    patientType: 'outPatient',
    medicalCodeList: [],
    inPatienList: [],
    loadingInpatients: false,
    avatarUpload: ''
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    updateLoading(state, payload) {
      return {...state, loading: payload};
    },

    select(state, payload) {
      return {...state, info: payload};
    },
    initAvatar(state, payload) {
      return {...state, avatarUpload: payload};
    },
    updatePatientDocument(state, payload) {
      return {...state, patientDocument: payload};
    },
    setMedicalCodeList(state, payload) {
      return {...state, medicalCodeList: payload }
    },
    incrementInPatients(state, payload) {
      return {...state, inPatienList: payload};
    },
    setLoadingInpatients(state, payload) {
      return {...state, loadingInpatients: payload};
    },
  },
  effects: dispatch => ({
    async getPatientDocument(payload) {
      // dispatch.patient.updateLoading(true);
      // const res = await client.get(combineUrlParams(`${formPath}`, { patientDocument: payload }));
      // dispatch.patient.updateLoading(false);
      // dispatch.patient.updatePatientDocument(res.data.data || {});
    },
    async fetPatient(payload) {
      dispatch.patient.updateLoading(true);

      const res = await client.get(
        combineUrlParams(`${patientPath}${INPATIENT_LIST}`, {
          page: "0",
          size: 10,
          ...payload,
        })
      );

      if (res.data.data && isArray(res.data.data)) {
        dispatch.patient.select(res.data.data[0] || {});
      }

      if (res.data.data && !res.data.data.length) {
        dispatch.patient.select(res.data.data[0] || {});
      }
      dispatch.patient.updateLoading(false);
    },

    async fetPatients(payload) {
      dispatch.patient.setLoadingInpatients(true);

      const res = await client.get(
        combineUrlParams(`${patientPath}${INPATIENT_LIST}`, {
          page: "0",
          size: 1000,
          ...payload,
        })
      );

      dispatch.patient.setLoadingInpatients(false);
      dispatch.patient.incrementInPatients(res.data.data || [])
    },

    async getMedicalCodeList(payload) {
      
      const res = await client.get(`${dataPath}${PATIENT_HISTORIES}?page=0&size=99999&patientValue=${payload|| ''}`);
      dispatch.patient.setMedicalCodeList(res.data.data)
    },
    async uploadAvatar(payload, state) {
      const dataForm = new FormData();
      dataForm.append("file", payload.fileUpload);

      for (const name in payload.fileUpload) {
        dataForm.append(name, payload.fileUpload[name]);
      }
      dataForm.append('id', payload.id)
      
      dataForm.append("user", "hubot");
     
      const response = await client.post(`${patientPath}${AVATAR}`, dataForm, {
        headers: { "Content-Type": undefined },
      });
      if(response.data){
        const info = state.patient.info
        const data = {
          ...info,
          avatar: response.data.data
        }
        this.select(data)
        dispatch.patient.initAvatar(response.data.data)
        message.success("Upload ảnh thành công!");
      }else {
        message.error(response.data.message || "Upload ảnh thành công!");
      }
    },
  })
}
