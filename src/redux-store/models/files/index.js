import { client, formPath } from "client/request";
import { forms, json_template } from "client/api";
import { combineFields } from "redux-store/models/config/constants";
import { combineUrlParams } from "utils";
import { message } from "antd";
import { get } from "lodash";

export default {
  state: {
    dataLoading: false,
    filesLoading: false,
    saveLoading: false,
    list: [],
    json: [],
    file: {},
    filesData: {},
    data: {},
    dataHIS: {},
    listForm: [],
    fileTemplate: {},
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    init(state, payload) {
      const listForms = [...state.list, ...payload];
      return { ...state, list: listForms };
    },
    updateFile(state, payload) {
      const listForms = [...state.list, payload];
      return { ...state, list: listForms, file: payload };
    },
    initClearFiles(state) {
      return { ...state, list: [] };
    },
    initJson(state, payload) {
      return { ...state, json: payload };
    },
    initTemplate(state, payload) {
      return { ...state, fileTemplate: payload };
    },
    fetchData(state, payload) {
      return { ...state, data: payload };
    },
    fetchDataHIS(state, payload) {
      return { ...state, dataHIS: payload };
    },
    setDataLoading(state, payload) {
      return { ...state, dataLoading: payload };
    },
    setFileLoading(state, payload) {
      return { ...state, filesLoading: payload };
    },
    setSaveLoading(state, payload) {
      return { ...state, saveLoading: payload };
    },
  },
  effects: (dispatch) => ({
    async getOne(payload) {
      dispatch.files.setFileLoading(true);
      const file = await client
        .get(`${formPath}${forms}/${payload || ""}`)
        .then((res) => get(res, "data.data", {}));
      dispatch.files.updateFile(file || {});
      dispatch.files.setFileLoading(false);
    },

    async getFiles(payload) {
      dispatch.files.setFileLoading(true);
      const promises = payload.map((formId) =>
        client
          .get(`${formPath}${forms}/${formId || ""}`)
          .then((res) => res.data.data)
      );
      const response = await Promise.all(promises);
      dispatch.files.init(response.map((file) => file || {}));
      dispatch.files.setFileLoading(false);
    },
    async clearFiles() {
      dispatch.files.initClearFiles();
    },
    async getJson(payload) {
      const response = await client
        .get(`${formPath}${payload}${json_template}`)
        .then((res) => res.data.data);
      const fields = combineFields(response);

      dispatch.files.initTemplate(response || {});
      dispatch.files.initJson(Object.keys(fields));
    },

    async updateLoad(payload) {
      dispatch.files.setSaveLoading(true);

      if (!payload.id) {
        const response = await client
          .post(`${formPath}${payload.api}`, payload)
          .then((res) => {
            dispatch.documents.fetchFiles(payload.patientDocument);
            return res.data.data;
          });

        dispatch.files.fetchData(combineFields(response));
        dispatch.files.setSaveLoading(false);
        message.success("Tạo mới thành công!");

      } else {

        const response = await client
          .put(`${formPath}${payload.api}/${payload.id}`, payload)
          .then((res) => {
            dispatch.documents.fetchFiles(payload.patientDocument);
            return res.data.data
          });

        dispatch.files.fetchData(combineFields(response));
        dispatch.files.setSaveLoading(false);
        message.success("Lưu thông tin thành công");
      }
    },
    async getFileData(payload) {
      dispatch.files.setDataLoading(true);

      if (payload.recordId) {
        const response = await
          client
            .get(combineUrlParams(`${formPath}${payload.file.api}/${payload.recordId}`, { patientDocument: payload.patientDocument,}))
            .then((res) => res.data.data);

        dispatch.files.fetchData(combineFields(response));
        dispatch.files.setDataLoading(false);
      } else {
        dispatch.files.fetchData({});
      }
    },

    async getFileDataHIS(payload) {
      dispatch.files.setDataLoading(true);
      const response = await
        client
          .get(combineUrlParams(`${formPath}${payload.file.api}/his`, { patientDocument: payload.patientDocument }))
          .then((res) => res.data.data);

      dispatch.files.fetchDataHIS(combineFields(response));
      dispatch.files.setDataLoading(false);
    },
  }),
};
