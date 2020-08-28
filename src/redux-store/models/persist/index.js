const { ...models } = require("../");
export default {
  state: {},
  reducers: {
    REHYDRATE(state, payload = {}) {
      let newPayload = {};
      for (let key in payload) {
        let model = models[key];
        if (model?.persist?.whitelist || model?.persist?.blacklist) {
          let whitelist = model?.persist?.whitelist;
          let blacklist = model?.persist?.blacklist || [];
          let obj = [];
          if (whitelist) {
            obj = whitelist
              .map((item) => {
                return { [item]: payload[item] };
              })
              .filter((item) => item);
          } else {
            obj = Object.keys(payload).map((item) => ({
              [item]: payload[item],
            }));
          }
          obj = obj.filter((item) => {
            return blacklist.indexOf(Object.keys(item)[0]) === -1;
          });
          obj.forEach((item) => {
            newPayload = { ...newPayload, ...item };
          });
        } else {
          newPayload[key] = payload[key];
        }
      }
      return { ...state, ...newPayload };
    },
  },
  effects: (dispatch) => ({}),
};
