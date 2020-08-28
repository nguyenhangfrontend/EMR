import { client, formPath } from "client/request";
import { DOCUMENTS, RECORD_TYPE } from "client/api";
import { combineUrlParams } from "utils";
import { get } from "lodash";
import { message } from 'antd';

export default {
  state: {
    template: [],
    templateName: '',
    files: [],
    dataDocument: {},
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setTemplateName(state, payload) {
      return {...state, templateName: payload}
    },
    setTemplate(state, payload) {
      return {...state, template: payload}
    },
    setFiles(state, payload) {
      return {...state, files: payload}
    },
    setDataDocument(state, payload){
      return {...state, dataDocument: payload}
    }
  },
  effects: dispatch => ({
    async fetchTemplate (payload) {
      const response = await client.get(combineUrlParams(`${formPath}${RECORD_TYPE}`, { patientDocument: payload }));
      dispatch.documents.setTemplate(get(response, 'data.data.dsBieuMau', []));
      dispatch.documents.setTemplateName(get(response, 'data.data.ten', ''));
      dispatch.documents.setDataDocument(get(response, 'data.data', {}))
    },

    async fetchFiles (payload) {
      const response = await client.get(combineUrlParams(`${formPath}${DOCUMENTS}`, { patientDocument: payload }));
      dispatch.documents.setFiles(get(response, 'data.data', []) || []);
    },
    async deleteFile (payload) {
      const response =await client.delete(combineUrlParams(`${formPath}/${payload.api}/${payload.recordId}`));
      if (response.data.code === 0) {
        message.success('Bản ghi đã bị xoá!');
        await dispatch.documents.fetchFiles(payload.patientDocument);
      } else {
        message.error(response.data.message)
      }
    }
  })
}
