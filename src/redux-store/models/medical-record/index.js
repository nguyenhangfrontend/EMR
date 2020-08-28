import { client, formPath, masterDataPath } from "client/request";
import { FORM_CATALOG, MEDICAL_RECORD_TYPE, RECORD_TYPE } from "client/api";
import { message } from "antd";
import { combineUrlParams } from "utils";
import cacheUtils from "utils/cache-utils";
import { cloneDeep } from "lodash";
import stringUtils from "mainam-react-native-string-utils";

export default {
  state: {},
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getAllMedicalRecordType: async (payload, state) => {
      let medicalRecordTypes = await cacheUtils.read(
        "",
        "DATA_MEDICAL_RECORD_TYPE",
        [],
        false
      );
      dispatch.medicalRecord.updateData({
        medicalRecordTypes,
      });

      let auth = state.auth.auth;
      if (auth && auth.id) {
        let res = await client.get(
          combineUrlParams(`${masterDataPath}${MEDICAL_RECORD_TYPE}`, {
            page: "0",
            size: 1000,
            sort: "name",
          })
        );
        if (res?.data?.code === 0) {
          medicalRecordTypes = (res.data.data || []).map((item) => ({
            id: item.id,
            name: item.name,
          }));
          dispatch.medicalRecord.updateData({
            medicalRecordTypes,
          });
          cacheUtils.save(
            "",
            "DATA_MEDICAL_RECORD_TYPE",
            medicalRecordTypes,
            false
          );
        }
      }
    },
    onCreateRecordType: (
      { ten = "", ma = "", loaiBa, mauBaId, active = false },
      state
    ) => {
      return new Promise((resolve, reject) => {
        dispatch.medicalRecord.updateData({
          isLoadingCreateRecordType: true,
        });
        client
          .post(`${formPath}${RECORD_TYPE}`, {
            ten,
            ma,
            loaiBa,
            mauBaId,
            active,
          })
          .then((s) => {
            if (s?.data?.code === 0) {
              let recordTypeTotal = state.medicalRecord.recordTypeTotal || 0;
              recordTypeTotal += 1;
              let dataRecordTypes = [
                s.data.data,
                ...(state.medicalRecord.dataRecordTypes || []),
              ];
              message.success("Thêm mới thành công");
              resolve(s?.data?.data);

              dispatch.medicalRecord.updateData({
                isLoadingCreateRecordType: false,
                recordTypeTotal,
                dataRecordTypes,
              });
              message.success("Thêm mới thành công");
              dispatch.medicalRecord.getDetail(s?.data?.data);
              // dispatch.medicalRecord.onSearchRecordType({ page: 0 });
              resolve(s?.data?.data);
            } else {
              message.error(s?.data?.message || "Tạo mới không thành công");
              dispatch.medicalRecord.updateData({
                isLoadingCreateRecordType: false,
              });
              reject(s);
            }
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.medicalRecord.updateData({
              isLoadingCreateRecordType: false,
            });
            reject(e);
          });
      });
    },
    onUpdateRecordType: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.medicalRecord.updateData({
          isLoadingCreateRecordType: true,
        });
        client
          .patch(`${formPath}${RECORD_TYPE}/${id}`, payload)
          .then((s) => {
            if (s?.data?.code === 0) {
              let dataRecordTypes = (
                state.medicalRecord.dataRecordTypes || []
              ).map((item) => {
                if (item.id === id) return s?.data?.data || {};
                return item;
              });

              dispatch.medicalRecord.updateData({
                isLoadingCreateRecordType: false,
                dataRecordTypes,
              });
              message.success("Cập nhật thành công");
              resolve(s?.data?.data);
            } else {
              message.error(s?.data?.message || "Cập nhật không thành công");
              dispatch.medicalRecord.updateData({
                isLoadingCreateRecordType: false,
              });
              reject();
            }
          })
          .catch((e) => {
            message.error(e?.message || "Cập nhật không thành công");
            dispatch.medicalRecord.updateData({
              isLoadingCreateRecordType: false,
            });
            reject();
          });
      });
    },
    onDeleteRecordType: (id) => {
      dispatch.medicalRecord.updateData({
        isLoadingRecordType: true,
      });
      client
        .delete(`${formPath}${FORM_CATALOG}/${id}`)
        .then((s) => {
          if (s?.data?.code === 0) {
            dispatch.medicalRecord.updateData({
              isLoadingRecordType: false,
            });
            message.success("Xoá thành công");
          } else {
            message.error(s?.data?.message || "Xoá không thành công");
            dispatch.medicalRecord.updateData({
              isLoadingRecordType: false,
            });
          }
        })
        .catch((e) => {
          message.error(e?.message || "Xoá không thành công");
          dispatch.medicalRecord.updateData({
            isLoadingRecordType: false,
          });
        });
    },
    onSizeChangeRecordType: ({ size = 10, ma = "", ten = "" }) => {
      dispatch.medicalRecord.updateData({
        recordTypeSize: size,
        recordTypePage: 0,
        dataRecordTypes: [],
      });
      dispatch.medicalRecord.onSearchRecordType({
        page: 0,
        reset: true,
        ma,
        ten,
      });
    },
    onSearchRecordType: async (
      { page, ma = "", ten = "", reset = false },
      state
    ) => {
      let newState = { isLoadingRecordType: true };
      if (reset) newState.dataRecordTypes = [];
      dispatch.medicalRecord.updateData(newState);
      let size = state.medicalRecord.recordTypeSize || 10;
      client
        .get(
          combineUrlParams(`${formPath}${RECORD_TYPE}`, {
            ma,
            ten,
            page: page + "",
            size: size,
            sort: "ten",
          })
        )
        .then((s) => {
          if (s?.data?.code === 0) {
            dispatch.medicalRecord.updateData({
              isLoadingRecordType: false,
              dataRecordTypes: s?.data?.data || [],
              recordTypePage: page,
              recordTypeTotal: s?.data?.totalElements || 0,
            });
            if (page === 0 && s.data.data.length) {
              dispatch.medicalRecord.getDetail(s.data.data[0]);
            }
          } else {
            dispatch.medicalRecord.updateData({
              isLoadingRecordType: false,
            });
            message.error(
              s?.data?.message || "Tải danh sách biểu mẫu không thành công"
            );
          }
        })
        .catch((e) => {
          dispatch.medicalRecord.updateData({
            isLoadingRecordType: false,
          });
          message.error(
            e?.message || "Tải danh sách biểu mẫu không thành công"
          );
        });
    },
    getDetail: async ({ id }, state) => {
      let newState = { isLoadingRecordType: true };
      dispatch.medicalRecord.updateData(newState);
      client
        .get(`${formPath}${RECORD_TYPE}/${id}`)
        .then((s) => {
          if (s?.data?.code === 0) {
            let recordType = s.data.data || {};
            if (!recordType.dsBieuMau) recordType.dsBieuMau = [];
            recordType.dsBieuMau.sort((a, b) => {
              return b.stt > a.stt ? -1 : 0;
            });
            dispatch.medicalRecord.updateData({
              isLoadingRecordType: false,
              recordType: recordType,
            });
          } else {
            dispatch.medicalRecord.updateData({
              isLoadingRecordType: false,
              recordType: null,
            });
            message.error(
              s?.data?.message || "Tải danh sách biểu mẫu không thành công"
            );
          }
        })
        .catch((e) => {
          dispatch.medicalRecord.updateData({
            isLoadingRecordType: false,
            recordType: null,
          });
          message.error(
            e?.message || "Tải danh sách biểu mẫu không thành công"
          );
        });
    },
    cloneRecordType: (payload, state) => {
      let recordType = cloneDeep(state.medicalRecord.recordType);
      if (!recordType.dsBieuMau) recordType.dsBieuMau = [];
      recordType.dsBieuMau = recordType.dsBieuMau.map((item, index) => {
        item.stt = index;
        return item;
      });
      dispatch.medicalRecord.updateData({
        recordTypeClone: recordType,
      });
    },
    addFormToRecordType: (
      {
        form,
        hsdd = false,
        macDinh = false,
        taoNhieuMau = false,
        active = true,
      },
      state
    ) => {
      let recordTypeClone = state.medicalRecord.recordTypeClone;
      if (recordTypeClone?.dsBieuMau?.length) {
        if (
          recordTypeClone.dsBieuMau.findIndex((x) => x.bieuMauId === form.id) >=
          0
        )
          return;
      }

      if (!recordTypeClone.dsBieuMau) recordTypeClone.dsBieuMau = [];
      recordTypeClone.dsBieuMau.push({
        stt: recordTypeClone.dsBieuMau.length,
        bieuMauId: form.id,
        bieuMau: form,
        hsdd,
        macDinh,
        taoNhieuMau,
        active,
      });
      dispatch.medicalRecord.updateData({
        recordTypeClone: { ...recordTypeClone },
      });
    },
    removeForm: ({ form = {} }, state) => {
      let recordTypeClone = state.medicalRecord.recordTypeClone;
      if (recordTypeClone) {
        recordTypeClone.dsBieuMau = (recordTypeClone.dsBieuMau || [])
          .filter((item) => item.bieuMauId != form.bieuMauId)
          .map((item, index) => {
            item.stt = index;
            return item;
          });
      }
      dispatch.medicalRecord.updateData({
        recordTypeClone: { ...recordTypeClone },
      });
    },
    reOrder: ({ forms = [] }, state) => {
      let recordTypeClone = state.medicalRecord.recordTypeClone;
      if (!recordTypeClone) return;
      if (!recordTypeClone.dsBieuMau) recordTypeClone.dsBieuMau = [];
      recordTypeClone.dsBieuMau = recordTypeClone.dsBieuMau.map(
        (item, index) => {
          let temp = forms.find((y) => y.bieuMauId === item.bieuMauId);
          if (temp) item.stt = temp.stt;
          return item;
        }
      );
      recordTypeClone.dsBieuMau.sort((a, b) => {
        return b.stt > a.stt ? -1 : 0;
      });

      dispatch.medicalRecord.updateData({
        recordTypeClone: { ...recordTypeClone },
      });
    },
    updateForm: ({ form = {}, draftMode }, state) => {
      return new Promise((resolve, reject) => {
        let recordType = null;
        if (draftMode)
          recordType = cloneDeep(state.medicalRecord.recordTypeClone);
        else recordType = cloneDeep(state.medicalRecord.recordType);

        if (recordType && recordType.dsBieuMau) {
          recordType.dsBieuMau = recordType.dsBieuMau.map((item, index) => {
            if (item.bieuMauId === form.bieuMauId) {
              item.hsdd = form.hsdd;
              item.macDinh = form.macDinh;
              item.active = form.active;
              item.taoNhieuMau = form.taoNhieuMau;
            }
            return item;
          });

          if (draftMode) {
            dispatch.medicalRecord.updateData({
              recordTypeClone: { ...recordType },
            });
            resolve();
          } else {
            dispatch.medicalRecord
              .onUpdateRecordType(recordType)
              .then((s) => {
                dispatch.medicalRecord.updateData({
                  recordType: { ...recordType },
                });
                resolve(s);
              })
              .catch((e) => {
                reject(e);
              });
          }
        }
      });
    },
    onSave: (payload, state) => {
      return new Promise((resolve, reject) => {
        let recordTypeClone = state.medicalRecord.recordTypeClone;
        dispatch.medicalRecord
          .onUpdateRecordType(recordTypeClone)
          .then((s) => {
            let list = s?.dsBieuMau?.sort((a, b) => {
              return b.stt > a.stt ? -1 : 0;
            });

            dispatch.medicalRecord.updateData({
              recordType: s,
            });
            resolve(s);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
  }),
};
