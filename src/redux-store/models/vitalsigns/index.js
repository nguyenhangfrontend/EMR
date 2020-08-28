import { cloneDeep } from "lodash";
import { formatName } from "utils/vital-signs/helpers";
import { combineUrlParams } from "utils";
import cacheUtils from "utils/cache-utils";
import {
  client,
  vitalSignPath,
  patientPath,
  masterDataPath,
} from "client/request";
import {
  VITAL_SIGNS,
  VITAL_SIGNS_CATEGORY,
  VITAL_SIGNS_PATIENT,
  VITAL_SIGNS_SURGERY,
  VITAL_SIGNS_PATIENT2,
  USERS,
} from "client/api";
import { message } from "antd";
export default {
  state: {},
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getDataVitalSigns: async (patientDocument, state) => {
      try {
        dispatch.vitalSigns.updateData({ isLoading: true, patientDocument });
        let res = await client.get(
          combineUrlParams(`${patientPath}${VITAL_SIGNS_PATIENT}`, {
            maHoSo: patientDocument,
          })
        );
        dispatch.vitalSigns.updateData({ isLoading: false });
        if (res?.data?.code === 0 && res?.data?.data) {
          dispatch.vitalSigns.updateData({
            patient: res.data.data || {},
          });

          res = await client.get(
            combineUrlParams(`${vitalSignPath}${VITAL_SIGNS}`, {
              page: "0",
              patientDocument,
              sort: "actDate",
            })
          );

          let data = res.data?.data || [];

          let values = [];
          let moreValueIds = [];
          let vitalSignsCategories =
            state.vitalSigns.vitalSignsCategories || [];
          data.map((item) => {
            return (moreValueIds = [
              ...moreValueIds,
              ...(item.chiSoKhac || []).filter((t) => {
                if (vitalSignsCategories && vitalSignsCategories.length) {
                  if (!vitalSignsCategories.find((y) => y.id === t.dmChiSoId))
                    return false;
                }
                return t.giaTri !== "" && t.giaTri !== undefined;
              }),
            ]);
          });
          moreValueIds = moreValueIds
            .map((item) => item.dmChiSoId)
            .filter((item, index, self) => {
              return self.indexOf(item) === index;
            });

          values = (data || []).map((item, index) => {
            let item2 = {
              id: item.id,
              date: new Date(item.actDate),
              huyetap:
                item.bpDiastolic === 0
                  ? ""
                  : item.bpDiastolic +
                    (item.bpSystolic ? "/" + item.bpSystolic : ""),
              cannang: item.weight,
              nhiet: item.temperature,
              nhiptho:
                item.respiratory && item.resuscitationMask
                  ? `${item.respiratory}/(bb)`
                  : item.respiratory,
              mach: item.pulse,
              kyten: formatName(item.nursing),
              isLoading: false,
              chiSoKhac: item.chiSoKhac || [],
              nbPhauThuat: item.nbPhauThuat,
            };
            return item2;
          });

          let last = data[data.length - 1] || {};
          let obj = {
            date: new Date(),
            huyetap: !last.bpDiastolic
              ? ""
              : last.bpDiastolic +
                (last.bpSystolic ? "/" + last.bpSystolic : ""),
            cannang: last.weight,
            nhiptho:
              last.respiratory && last.resuscitationMask
                ? `${last.respiratory}/(bb)`
                : last.respiratory,
            chiSoKhac: [],

            // kyten: formatName(s.username),
          };
          values.push(obj);
          console.log(values);

          dispatch.vitalSigns.updateData({
            resState: data,
            values,
            moreValueIds: moreValueIds || [],
            isDone: false,
            isEditing: false,
            typeValue: 1,
            isDeleting: false,
            allowEdit: false,
            isLoading: false,
            index: -1,
          });
        } else {
          message.error(
            res?.data?.message || "Không tìm thấy thông tin bệnh nhân"
          );
        }
      } catch (error) {
        const valueFailed = [
          {
            date: new Date(),
          },
        ];
        dispatch.vitalSigns.updateData({
          isLoading: false,
          resState: [],
          values: valueFailed,
          isDone: false,
          isEditing: false,
          isDeleting: false,
          typeValue: 1,
          allowEdit: true,
        });
      }
    },
    getAllCategory: async (payload) => {
      dispatch.vitalSigns.updateData({ isLoadingCategory: true });
      let res = await client.get(
        combineUrlParams(`${vitalSignPath}${VITAL_SIGNS_CATEGORY}`, {
          page: "0",
          sort: "ten",
          ...payload,
        })
      );
      dispatch.vitalSigns.updateData({ isLoadingCategory: false });
      if (res?.data?.code === 0) {
        dispatch.vitalSigns.updateData({
          categories: res.data.data || [],
        });
      }
    },
    getAllVitalSignsCategory: async () => {
      let cache = await cacheUtils.read("", "DATA-CATEGORIES", [], false);
      dispatch.vitalSigns.updateData({
        vitalSignsCategories: cache || [],
      });
      let res = await client.get(
        combineUrlParams(`${vitalSignPath}${VITAL_SIGNS_CATEGORY}`, {
          page: "0",
          active: "true",
          sort: "ten",
        })
      );
      if (res?.data?.code === 0) {
        let data = (res.data.data || []).map((item) => ({
          ten: item.ten,
          id: item.id,
          donVi: item.donVi,
        }));
        cacheUtils.save(null, "DATA-CATEGORIES", data, false);
        dispatch.vitalSigns.updateData({
          vitalSignsCategories: data,
        });
      }
    },
    async createEditCategory(payload) {
      let res = {};
      let successMessage;
      let errMessage;
      if (payload.id) {
        res = await client
          .put(
            `${vitalSignPath}${VITAL_SIGNS_CATEGORY}/${payload.id}`,
            payload.dataSubmit
          )
          .then((res) => res.data);
        successMessage =
          res?.message || "Cập nhật thông tin chỉ số sống Thành công";
        errMessage =
          res?.message || "Cập nhật thông tin chỉ số sống  không thành công";
      } else {
        res = await client
          .post(`${vitalSignPath}${VITAL_SIGNS_CATEGORY}`, payload.dataSubmit)
          .then((res) => res.data);
        successMessage = res?.message || "Tạo mới chỉ số sống Thành công";
        errMessage = res?.message || "Tạo mới chỉ số sống  không thành công";
      }

      if (res?.code === 0) {
        this.getAllCategory();
        message.success(successMessage);
      } else {
        message.error(errMessage);
      }
    },

    async deleteCategory(payload) {
      const res = await client
        .delete(`${vitalSignPath}${VITAL_SIGNS_CATEGORY}/${payload}`)
        .then((res) => res.data);
      if (res?.code === 0) {
        this.getAllCategory();
        message.success("Xóa chỉ số sống thành công");
      } else {
        message.error("xóa chỉ số sống không thành công");
      }
    },

    onUpdate: (payload, state) => {
      return new Promise(async (resolve, reject) => {
        dispatch.vitalSigns.updateData({
          isLoading: true,
        });
        const values = cloneDeep(state.vitalSigns.values);
        let index = state.vitalSigns.index;
        let huyetap = (values[index].huyetap || "").split("/");
        let id = state.vitalSigns.resState[index].id;
        const splitValues = values[index].nhiptho
          ? (values[index].nhiptho + "").split("/")
          : [];
        let nhiet = Math.round(values[index].nhiet * 10) / 10;
        let mach = Math.round(values[index].mach);
        if (state.vitalSigns.isDeleting) {
          if (state.vitalSigns.typeValue === 1) {
            mach = 0;
            values[index].mach = 0;
          }
          if (state.vitalSigns.typeValue === 2) {
            nhiet = 0;
            values[index].nhiet = 0;
          }
        }

        let res = await client.put(`${vitalSignPath}${VITAL_SIGNS}/${id}`, {
          temperature: nhiet,
          pulse: mach,
          weight: values[index].cannang,
          bpSystolic: huyetap[1] || 0,
          bpDiastolic: huyetap[0] || 0,
          respiratory: splitValues[0] || "",
          resuscitationMask: !!(splitValues[1] || ""),
          nursing: values[index].kyten,
          actDate: values[index].date,
          patientDocument: state.vitalSigns.patient.maHoSo,
          medicalRecordNo: state.vitalSigns.patient.maBenhAn,
          patientName: state.vitalSigns.patient.tenNb,
          birthday: state.vitalSigns.patient.ngaySinh
            .toDateObject()
            .format("yyyy-MM-dd"),
          bed: (state.vitalSigns.bed || {}).name || "",
          room: (state.vitalSigns.room || {}).name || "",
          gender: state.vitalSigns.patient.gioiTinh,
          diagnostic: (state.vitalSigns.disease || {}).name || "",
          chiSoKhac: values[index].chiSoKhac || [],
        });
        if (res?.data?.code === 0) {
          dispatch.vitalSigns.updateData({
            isEditing: false,
            allowEdit: false,
            isDeleting: false,
            isLoading: false,
            values: values,
          });
          message.success("Lưu thành công");
          resolve();
        } else {
          dispatch.vitalSigns.updateData({
            isLoading: false,
          });
          message.error(res?.data?.message || "Lưu không thành công");
          reject();
        }
      });
    },
    onCreate: async (payload, state) => {
      dispatch.vitalSigns.updateData({
        isLoading: true,
      });
      const values = cloneDeep(state.vitalSigns.values);
      let item = values[values.length - 1];
      const huyetap = ((item.huyetap || "") + "").split("/");
      const nhiptho = ((item.nhiptho || "") + "").split("/");
      if (
        item.huyetap ||
        item.cannang ||
        item.nhiet ||
        item.nhiptho ||
        item.mach
      ) {
        let res = await client.post(`${vitalSignPath}${VITAL_SIGNS}`, {
          temperature: Math.round(item.nhiet * 10) / 10,
          pulse: Math.round(item.mach),
          weight: item.cannang,
          bpSystolic: huyetap[1] || 0,
          bpDiastolic: huyetap[0] || 0,
          respiratory: nhiptho[0] || "",
          resuscitationMask: !!(nhiptho[1] || ""),
          nursing: state.auth.auth?.username || "",
          actDate: item.date,
          patientDocument: state.vitalSigns.patient.maHoSo,
          medicalRecordNo: state.vitalSigns.patient.maBenhAn,
          patientName: state.vitalSigns.patient.tenNb,
          birthday: state.vitalSigns.patient.ngaySinh
            .toDateObject()
            .format("yyyy-MM-dd"),
          bed: (state.vitalSigns.bed || {}).name || "",
          room: (state.vitalSigns.room || {}).name || "",
          gender: state.vitalSigns.patient.gioiTinh,
          diagnostic: (state.vitalSigns.disease || {}).name || "",
          chiSoKhac: item.chiSoKhac || [],
        });
        if (res?.data?.code === 0) {
          item.id = res?.data?.data?.id;
          item.kyten = formatName(res?.data?.data?.nursing || "");
          let resState = [...values];
          let last = values[values.length - 1] || {};
          let obj = {
            date: new Date(),
            huyetap: !last.bpDiastolic
              ? ""
              : last.bpDiastolic +
                (last.bpSystolic ? "/" + last.bpSystolic : ""),
            cannang: last.weight,
            nhiptho:
              last.respiratory && last.resuscitationMask
                ? `${last.respiratory}/(bb)`
                : last.respiratory,
            chiSoKhac: [],
          };
          values.push(obj);

          dispatch.vitalSigns.updateData({
            isLoading: false,
            resState,
            values: [...values],
          });
          message.success("Lưu thành công");
          return values;
        } else {
          dispatch.vitalSigns.updateData({
            isLoading: false,
          });
          message.error(res?.data?.message || "Lưu không thành công");
          return false;
        }
      } else {
        dispatch.vitalSigns.updateData({
          isLoading: false,
        });
        message.error("Vui lòng điền ít nhất một thông tin");
      }
    },
    onCancel: (payload, state) => {
      dispatch.vitalSigns.updateData({
        values: [...state.vitalSigns.preValues],
        isDeleting: false,
        isEditing: false,
      });
    },
    getAllDoctor: async () => {
      let cache = await cacheUtils.read("", "DATA-DOCTORS", [], false);
      dispatch.vitalSigns.updateData({
        doctors: cache || [],
      });
      let res = await client.get(
        combineUrlParams(`${masterDataPath}${USERS}`, {
          page: "0",
          size: 2000,
          active: "true",
          sort: "fullName",
          doctor: "true",
        })
      );
      if (res?.data?.code === 0) {
        let data = res.data.data
          .map((item) => ({
            id: item.id,
            username: item.username,
            value: item.value,
            fullName: item.fullName,
            qualificationName: item.qualification?.name,
            departmentId: item.departmentId,
            departmentName: item.department?.name,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex((t) => t.fullName === item.fullName) === index
            );
          });
        cacheUtils.save(null, "DATA-DOCTORS", data, false);
        dispatch.vitalSigns.updateData({
          doctors: data || [],
        });
      }
    },
    onCreateSurgery: async (payload, state) => {
      let res = await client.post(
        `${vitalSignPath}${VITAL_SIGNS_SURGERY}`,
        payload
      );
      const { vitalSignsId } = payload;
      if (res?.data?.code === 0) {
        let values = state.vitalSigns.values;
        let item = values.find((i) => i.id === vitalSignsId);
        if (item) {
          item.nbPhauThuat = res.data.data;
          dispatch.vitalSigns.updateData({
            values: [...values],
          });
          message.success("Thêm thông tin phẫu thuật thành công");
          return values;
        }
      } else {
        message.error(
          res?.data?.message || "Thêm thông tin phẫu thuật không thành công",
          "danger"
        );
      }
      return false;
    },
    onRemoveSurgery: async (vitalSignsId, state) => {
      let values = state.vitalSigns.values;
      let item = values.find((i) => i.id === vitalSignsId);
      if (item && item.nbPhauThuat) {
        let res = await client.delete(
          `${vitalSignPath}${VITAL_SIGNS_SURGERY}/${item.nbPhauThuat.id}`
        );
        if (res?.data?.code === 0) {
          item.nbPhauThuat = null;
          dispatch.vitalSigns.updateData({
            values: [...values],
            isEditing: false,
            isDeleting: false,
          });
          message.success("Xoá thành công");
          return values;
        } else {
          message.error(
            res?.data?.message || "Xoá thông tin phẫu thuật không thành công",
            "danger"
          );
        }
      } else {
        message.error("Không tồn tại thông tin phẫu thuật");
      }
      return false;
    },
    onUpdateSurgery: async ({ id, bacSy, phuongPhapPhauThuat }) => {
      let res = await client.put(
        `${vitalSignPath}${VITAL_SIGNS_SURGERY}/${id}`,
        {
          bacSy,
          phuongPhapPhauThuat,
        }
      );
      if (res?.data?.code === 0) {
        message.success(
          res?.data?.message || "Cập nhật thông tin phẫu thuật thành công"
        );
      } else {
        message.error(
          res?.data?.message || "Cập nhật thông tin phẫu thuật không thành công"
        );
      }
    },
    getDataToPrint: async ({ patientDocument }, state) => {
      dispatch.vitalSigns.updateData({
        isLoadingPrint: true,
        dataPrint: null,
      });
      let promises = [];
      //detail patient
      promises.push(
        new Promise(async (resolve, reject) => {
          client
            .get(
              combineUrlParams(`${patientPath}${VITAL_SIGNS_PATIENT2}`, {
                patientDocument: patientDocument,
                page: "0",
                active: "true",
                // sort: "actDate",
              })
            )
            .then((res) => {
              if (res?.data?.code === 0 && res?.data?.data?.length) {
                resolve((res?.data?.data || [])[0]);
              } else {
                message.error(
                  res?.data?.message || "Không tìm thấy thông tin bệnh nhân"
                );
                reject(null);
              }
            })
            .catch((e) => {
              message.error(e?.message || "Không tìm thấy thông tin bệnh nhân");
              resolve(null);
            });
        })
      );
      //get all category
      promises.push(
        new Promise(async (resolve, reject) => {
          client
            .get(
              combineUrlParams(`${vitalSignPath}${VITAL_SIGNS_CATEGORY}`, {
                page: "0",
                active: "true",
                sort: "ten",
              })
            )
            .then((res) => {
              if (res?.data?.code === 0) {
                resolve(res?.data?.data);
              } else resolve([]);
            })
            .catch((e) => {
              resolve([]);
            });
        })
      );
      //get all data
      promises.push(
        new Promise((resolve, reject) => {
          client
            .get(
              combineUrlParams(`${vitalSignPath}${VITAL_SIGNS}`, {
                page: "0",
                patientDocument,
                sort: "actDate",
              })
            )
            .then((res) => {
              if (res?.data?.code === 0) {
                resolve(res.data.data || []);
              } else {
                message.error(
                  res?.data?.message ||
                    "Tải dữ liệu chức năng sống không thành công"
                );
                reject();
              }
            })
            .catch((e) => {
              resolve([]);
            });
        })
      );
      Promise.all(promises)
        .then((_values) => {
          console.log(_values);
          let patient = _values[0];
          let values = [];
          let moreValueIds = [];
          _values[2].map((item) => {
            return (moreValueIds = [
              ...moreValueIds,
              ...(item.chiSoKhac || []).filter(
                (t) => t.giaTri !== "" && t.giaTri !== undefined
              ),
            ]);
          });
          moreValueIds = moreValueIds
            .map((item) => item.dmChiSoId)
            .filter((item, index, self) => {
              return self.indexOf(item) === index;
            });

          values = (_values[2] || []).map((item, index) => {
            let item2 = {
              id: item.id,
              date: new Date(item.actDate),
              huyetap:
                item.bpDiastolic === 0
                  ? ""
                  : item.bpDiastolic +
                    (item.bpSystolic ? "/" + item.bpSystolic : ""),
              cannang: item.weight,
              nhiet: item.temperature,
              nhiptho:
                item.respiratory && item.resuscitationMask
                  ? `${item.respiratory}/(bb)`
                  : item.respiratory,
              mach: item.pulse,
              kyten: formatName(item.nursing),
              isLoading: false,
              chiSoKhac: item.chiSoKhac || [],
              nbPhauThuat: item.nbPhauThuat,
            };
            return item2;
          });
          dispatch.vitalSigns.updateData({
            isLoadingPrint: false,
            vitalSignsCategories: _values[1] || [],
            dataPrint: {
              patient: patient,
              values: values,
              moreValueIds: moreValueIds || [],
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  }),
};
