import React from "react";
import { message, notification } from "antd";
import { combineUrlParams } from "utils";
import { client, medicinePath } from "client/request";
import {
  NOTIFICATION_SEARCH,
  NOTIFICATION_SET_READ,
  NOTIFICATION_GET_TOTAL,
} from "client/api";
export default {
  state: {},
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onSearch: async (page, state) => {
      if (
        state.notification.isLoading ||
        (page !== 0 && state.notification.finished)
      ) {
        return;
      }
      let newData = { isLoading: true, isRefreshing: false, isLoadMore: false };
      if (page === 0) newData.isRefreshing = true;
      else newData.isLoadMore = true;
      dispatch.notification.updateData(newData);
      let res = await client.get(
        combineUrlParams(`${medicinePath}${NOTIFICATION_SEARCH}`, {
          page: page + "",
          size: 20,
          sort: "thoiGian,desc",
        })
      );
      if (res?.data?.code === 0) {
        let data = state.notification.notifications || [];
        if ((res?.data?.data || []).length !== 0) {
          data = [...(page === 0 ? [] : data), ...(res?.data?.data || [])];
          dispatch.notification.updateData({
            isLoading: false,
            isLoadMore: false,
            isRefreshing: false,
            notifications: data,
            page,
          });
        } else {
          dispatch.notification.updateData({
            isLoading: false,
            isLoadMore: false,
            isRefreshing: false,
            finished: true,
          });
        }
      } else {
        dispatch.notification.updateData({
          isLoading: false,
          isLoadMore: false,
          isRefreshing: false,
        });
        message.error(
          res?.data?.message || "Tải danh sách thông báo không thành công"
        );
      }
    },
    onRefresh: (clear = false) => {
      let newData = { page: 0, finished: false };
      if (clear) newData.notifications = [];
      dispatch.notification.updateData(newData);
      dispatch.notification.onSearch(0);
    },

    setRead: async (item = {}, state) => {
      let notifications = state.notification.notifications || [];
      notifications = notifications.map((x) => {
        if (x.id === item.id) {
          x.trangThai = 30;
        }
        return x;
      });
      let totalUnread =
        (state.notification.totalUnread || 0) - 1 < 0
          ? 0
          : (state.notification.totalUnread || 0) - 1;
      dispatch.notification.updateData({
        notifications: [...notifications],
        totalUnread,
      });
      await client.put(`${medicinePath}${NOTIFICATION_SET_READ}/${item.id}`);
      dispatch.notification.getTotalUnread();
    },

    getTotalUnread: async (payload, state) => {
      if (!state.auth.auth) return;
      let res = await client.get(
        combineUrlParams(`${medicinePath}${NOTIFICATION_GET_TOTAL}`, {
          trangThai: 10,
        })
      );
      if (res?.data?.code === 0) {
        dispatch.notification.updateData({
          totalUnread: res?.data?.data || 0,
        });
      }
    },
    loadNotification: () => {
      dispatch.notification.onRefresh(true);
      dispatch.notification.getTotalUnread();
    },
    setReadAll: async () => {
      let res = await client.put(`${medicinePath}${NOTIFICATION_SET_READ}`);
      if (res?.data?.code === 0) {
        dispatch.notification.updateData({
          totalUnread: 0,
          isLoading: false,
          isRefreshing: false,
          notifications: [],
        });
        dispatch.notification.onRefresh(true);
      } else {
        message.error(res?.data?.message || "Xảy ra lỗi, vui lòng thử lại sau");
      }
    },
    showInAppNotification: async (payload, state) => {
      if (!state.auth.auth) return;
      dispatch.notification.getTotalUnread();
      let lastId = state.notification.lastId || 0;
      let res = await client.get(
        combineUrlParams(`${medicinePath}${NOTIFICATION_SEARCH}`, {
          page: "0",
          size: 20,
          sort: "thoiGian,desc",
        })
      );
      if (res?.data?.code === 0 && res?.data?.data) {
        let notifications = res?.data?.data || [];
        dispatch.notification.updateData({
          lastId: notifications[0]?.id || lastId,
        });
        if (lastId) {
          notifications = notifications.filter((item) => item.id > lastId);
          const getContent = (item) => {
            let text = "";
            switch (item.loai) {
              case 10:
                text = "Y lệnh mới";
                break;
              case 20:
                text = "Phiếu lĩnh chưa duyệt ";
                break;
              case 30:
                text = "Thuốc chưa cấp";
                break;
              default:
                text = "";
            }
            return text + ` - NB ${item.tenNb}`;
          };
          if (notifications && notifications.length) {
            notifications.forEach((item, index) => {
              notification.open({
                key: index,
                description: (
                  <div>
                    <div>{getContent(item)}</div>
                    <div>{"Mã BA: " + (item.maBenhAn || item.maHoSo)}</div>
                  </div>
                ),
                message: (
                  <div className="date-area">
                    <div className="date">
                      {item.thoiGian?.toDateObject().format("dd/MM")}
                    </div>
                    <div className="date">
                      {item.thoiGian?.toDateObject().format("HH:mm")}
                    </div>
                  </div>
                ),
                className: "emr-notification",
              });
            });
          }
        }
      }
    },
  }),
};
