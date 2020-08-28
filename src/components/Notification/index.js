import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Spin, Button } from "antd";
import { Main } from "./styled";
import T from "prop-types";

function Notification(props) {
  useEffect(() => {
    props.updateData({
      isLoading: false,
      isLoadMore: false,
      isRefreshing: false,
    });
    if (props.show) props.loadNotification();
  }, [props.show]);
  const setReadAll = () => {
    props.setReadAll();
  };
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
    }
    return text + ` - NB ${item.tenNb}`;
  };
  const handleLoadMore = () => {
    props.onSearch(props.page + 1);
  };
  const setRead = (item) => () => {
    props.setRead(item);
  };
  const onScroll = (e) => {
    let obj = e.target;
    if (obj.scrollTop === obj.scrollHeight - obj.offsetHeight) {
      handleLoadMore();
    }
  };
  return (
    <Main>
      {props.totalUnread ? (
        <Button className="button-read-all" type="primary" onClick={setReadAll}>
          Đánh dấu đã đọc
        </Button>
      ) : null}
      <Spin spinning={props.isRefreshing}>
        <div className="list-notification" onScroll={onScroll}>
          {(props.data || []).map((item, index) => (
            <div key={index} onClick={setRead(item)} style={{ flex: 1 }}>
              <hr className="break-line" />

              <div
                className="item"
                style={
                  item.trangThai !== 30 ? { backgroundColor: "#08AAA820" } : {}
                }
              >
                <div className="date-area">
                  <div className="date">
                    {item.thoiGian?.toDateObject().format("dd/MM")}
                  </div>
                  <div className="date">
                    {item.thoiGian?.toDateObject().format("HH:mm")}
                  </div>
                </div>
                <div className="item-content">
                  <div className="item-content-text">{getContent(item)}</div>
                  <div className="item-content-text">
                    Mã BA: {item.maBenhAn || item.maHoSo}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </Main>
  );
}

Notification.propTypes = {
  show: T.bool,
};

export default connect(
  (state) => ({
    page: state.notification.page || 0,
    isRefreshing: state.notification.isRefreshing,
    isLoading: state.notification.isLoading,
    isLoadMore: state.notification.isLoadMore,
    data: state.notification.notifications || [],
    totalUnread: state.notification.totalUnread || 0,
  }),
  ({
    notification: {
      onRefresh,
      onSearch,
      updateData,
      setRead,
      loadNotification,
      setReadAll,
      getTotalUnread,
    },
  }) => ({
    onRefresh,
    onSearch,
    updateData,
    setRead,
    loadNotification,
    setReadAll,
    getTotalUnread,
  })
)(Notification);
