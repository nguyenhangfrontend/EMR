import { client, formPath } from "client/request";
import { FORM_CATALOG, forms } from "client/api";
import { message } from "antd";
import { combineUrlParams } from "utils";
import cacheUtils from "utils/cache-utils";

export default {
  state: {},
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getAllForm: async (payload, state) => {
      let auth = state.auth.auth;
      if (auth && auth.id) {
        let listForms = await cacheUtils.read(auth.id, "DATA_FORM", [], false);
        dispatch.form.updateData({
          forms: listForms,
        });
        let res = await client.get(
          combineUrlParams(`${formPath}${forms}`, {
            page: "0",
          })
        );
        if (res?.data?.code === 0) {
          listForms = (res.data.data || []).map((item) => ({
            id: item.id,
            name: item.name,
          }));
          dispatch.form.updateData({
            forms: listForms,
          });
          cacheUtils.save(auth.id, "DATA_FORM", listForms, false);
        }
      }
    },
    onCreate: (
      {
        ten = "",
        ma = "",
        active = false,
        hsdd = false,
        editor = false,
        formId = "",
      },
      state
    ) => {
      return new Promise((resolve, reject) => {
        dispatch.form.updateData({
          isLoadingCreate: true,
        });
        client
          .post(`${formPath}${FORM_CATALOG}`, {
            ten,
            ma,
            active,
            editor,
            hsdd,
            formId,
          })
          .then((s) => {
            if (s?.data?.code === 0) {
              let total = state.form.total || 0;
              total += 1;
              let data = [s.data.data, ...(state.form.data || [])];
              dispatch.form.updateData({
                isLoadingCreate: false,
                total,
                data,
              });
              message.success("Thêm mới thành công");
              resolve(s?.data?.data);
            } else {
              message.error(s?.data?.message || "Tạo mới không thành công");
              dispatch.form.updateData({
                isLoadingCreate: false,
              });
              reject(s);
            }
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.form.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.form.updateData({
          isLoadingCreate: true,
        });
        client
          .put(`${formPath}${FORM_CATALOG}/${id}`, payload)
          .then((s) => {
            if (s?.data?.code === 0) {
              let data = (state.form.data || []).map((item) => {
                if (item.id === id) return s?.data?.data || {};
                return item;
              });

              dispatch.form.updateData({
                isLoadingCreate: false,
                data,
              });
              message.success("Cập nhật thành công");
              resolve(s);
            } else {
              message.error(s?.data?.message || "Cập nhật không thành công");
              dispatch.form.updateData({
                isLoadingCreate: false,
              });
              reject(s);
            }
          })
          .catch((e) => {
            message.error(e?.message || "Cập nhật không thành công");
            dispatch.form.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onDelete: (id) => {
      dispatch.form.updateData({
        isLoadingCreate: true,
      });
      client
        .delete(`${formPath}${FORM_CATALOG}/${id}`)
        .then((s) => {
          if (s?.data?.code === 0) {
            dispatch.form.updateData({
              isLoadingCreate: false,
            });
            message.success("Xoá thành công");
          } else {
            message.error(s?.data?.message || "Xoá không thành công");
            dispatch.form.updateData({
              isLoadingCreate: false,
            });
          }
        })
        .catch((e) => {
          message.error(e?.message || "Xoá không thành công");
          dispatch.form.updateData({
            isLoadingCreate: false,
          });
        });
    },
    onSizeChange: ({ size = 10, ma = "", ten = "", active, loaiHoSoBaId }) => {
      dispatch.form.updateData({
        size,
        page: 0,
        data: [],
      });
      dispatch.form.onSearch({
        page: 0,
        reset: true,
        ma,
        ten,
        active,
        loaiHoSoBaId,
      });
    },
    onSearch: async (
      {
        page,
        ma = "",
        ten = "",
        reset = false,
        timKiem = "",
        active,
        loaiHoSoBaId,
      },
      state
    ) => {
      let newState = { isLoading: true };
      if (reset) newState.data = [];
      dispatch.form.updateData(newState);
      let size = state.form.size || 10;
      client
        .get(
          combineUrlParams(`${formPath}${FORM_CATALOG}`, {
            ma,
            ten,
            timKiem,
            page: page + "",
            size: size,
            sort: "ten",
            active,
            loaiHoSoBaId,
          })
        )
        .then((s) => {
          if (s?.data?.code === 0) {
            dispatch.form.updateData({
              isLoading: false,
              data: s?.data?.data || [],
              page,
              total: s?.data?.totalElements || 0,
            });
          } else {
            dispatch.form.updateData({
              isLoading: false,
            });
            message.error(
              s?.data?.message || "Tải danh sách biểu mẫu không thành công"
            );
          }
        })
        .catch((e) => {
          dispatch.form.updateData({
            isLoading: false,
          });
          message.error(
            e?.message || "Tải danh sách biểu mẫu không thành công"
          );
        });
    },
  }),
};
