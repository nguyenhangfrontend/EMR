import { data } from "mokup";
import { client, signer } from "client/request";
import { SIGN, FILE, HISTORY } from "client/api";
import { combineUrlParams } from "utils";
export default {
  state: {
    fileSigned: "",
    historySigned: [],
    fileName: ''
  }, // initial state
  reducers: {
    initHistory(state, payload) {
      return { ...state, historySigned: payload };
    },
    setFileSigned(state, payload) {
      return { ...state, fileSigned: payload };
    },
    initFileName(state, payload) {
      return { ...state, fileName: payload };
    },
  },
  effects: (dispatch) => ({
    async getHistorySigned(payload) {
      const res = await client.get(
        combineUrlParams(`${signer}${HISTORY}`, {
          page: "0",
          size: 999,
          sort: "id,desc",
          ...payload,
        })
      );

      let histories = res.data.data;
      let obj = {};

      let arr = [];
      if (res.data.data) {
        res.data.data
          .filter((item) => {
            return item.status === 0;
          })
          .sort(function (itema, itemb) {
            return itema.actDate < itemb.actDate ? 1 : -1;
          });

        histories.forEach((item) => {
          if (item.status !== 0) return;
          if (!obj[item.fileName]) {
            obj[item.fileName] = [];
          }
          obj[item.fileName].push(item);
        });

        let keys = Object.keys(obj);
        keys.forEach((key) => {
          arr.push(obj[key]);
        });
      }
      if (!payload.recordId) {
        arr = [];
      }
      dispatch.signer.initHistory(arr);
    },


    async sign(payload, rootState) {
      const data = {
        fileName: payload.fileName,
        formValue: payload.formValue,
        patientDocument: payload.patientDocument,
        recordId: payload.recordId,
        sequenceNo: payload.sequenceNo,
      };

      const dataForm = new FormData();
      dataForm.append("file", payload.file);

      for (const name in payload.file) {
        dataForm.append(name, payload.file[name]);
      }
      dataForm.append('data', JSON.stringify(data))
      dataForm.append("user", "hubot");
     
      const response = await client.post(`${signer}${SIGN}`, dataForm, {
        headers: { "Content-Type": undefined },
      });
      if(response.data?.data){
        this.loadFileSigned(response.data.data.signedFilePath);
      }
      
    },

    async loadFileSigned(payload, rootState) {
      const res = await client.get(`${signer}${FILE}/${payload}`, {
        responseType: "arraybuffer",
      });
      // console.log(res)
      // dispatch.signer.initFileName(payload.fileName)
      dispatch.signer.setFileSigned(res.data);
    },
  }),
};
