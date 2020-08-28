import { init } from "@rematch/core";
import * as models from "./models";
import createPersistPlugin from "@rematch/persist";
import createEncryptor from "redux-persist-transform-encrypt";
import localForage from "localforage";

const encryptor = createEncryptor({
  secretKey: "private-encrypt-key",
  onError: function (error) {
    // Handle the error.
  },
});

const persistPlugin = createPersistPlugin({
  key: "root-product",
  version: 1,
  storage: localForage,
  whitelist: ["auth"],
  transforms: [encryptor],
});

const store = init({
  models,
  plugins: [persistPlugin],
});

const getState = store.getState;
export { getState };
export default store;
