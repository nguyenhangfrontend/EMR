import React, { useEffect, useState } from "react";
import T from 'prop-types';
import { connect } from "react-redux";
import { Table, Spin, Checkbox, Icon } from "antd";
import { isEmpty } from "lodash";
import { Main } from "./styled";
import Search from "./Search";
import EditIcon from "assets/svg/edit.svg";
import Create_Edit from "./Create_Edit";
import DeletePopup from "./DeleteModal";
import Pagination from 'components/Pagination';

const PatientList = ({
  isLoadingCategory,
  categories,
  getAllDepartments,
}) => {
  const { Column } = Table;
  const [categoriesPagination, setPatients] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isDelete, setOpenDelete] = useState(false);
  const [cssId, setCSSId] = useState(false);
  const [view, setView] = useState(false);
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getAllDepartments();
  }, []);

  useEffect(() => {
    const paginationCategories = !isEmpty(categories)
      ? categories.slice(0, pageSize)
      : [];
    setPatients(paginationCategories);
  }, [categories]);

  const onChangePage = (page) => {
    const paginationCategories = !isEmpty(categories) ? categories.slice(page - 1, pageSize) : [];

    setPatients(paginationCategories);
    setCurrentPage(page);
  };

  const selectRow = (visible, item) => {
    setView(true);
    showModal(visible, item);
  };
  const showModal = (visible, record) => {
    setVisible(visible);
    setData(record);
  };

  const onShowSizeChange = (current, size) => {
    const patientLocals = !isEmpty(categories)
      ? categories.slice((current - 1)*size, (current - 1)*size + size)
      : [];

    setPatients(patientLocals);
    setPageSize(size);
    setCurrentPage(current);
  };

  return (
    <Main>
      <h2 className="title-list">Danh mục chỉ số sống</h2>
      <Search handleShowModal={showModal} />
      <Spin spinning={isLoadingCategory}>
        <div className="patient-list">
          <Table
            dataSource={categoriesPagination}
            rowKey="id"
            pagination={false}
          >
            <Column
              title={"STT"}
              key="index"
              render={(value, item, index) => <span>{`${(currentPage-1)*pageSize + index + 1}`}</span>}
            />
            <Column title={"Tên chỉ số"} dataIndex="ten" key="ten" />
            <Column title={"Đơn vị"} dataIndex="donVi" key="donVi" />
            <Column
              title={"Giá trị tối thiểu"}
              dataIndex="giaTriNhoNhat"
              key="giaTriNhoNhat"
            />
            <Column
              title={"Giá trị tối đa"}
              dataIndex="giaTriLonNhat"
              key="giaTriLonNhat"
            />

            <Column
              title={"Có hiệu lực"}
              dataIndex="active"
              key="active"
              align="center"
              render={(text, record) => <Checkbox checked={record.active} />}
            />
            <Column
              title={"Thao tác"}
              render={(text, record) => (
                <div className="action">
                  <Icon
                    type="eye"
                    onClick={() => selectRow(true, record)}
                    style={{ color: "#08AAA8" }}
                  />
                  <Icon
                    component={EditIcon}
                    onClick={() => showModal(true, record)}
                  />
                </div>
              )}
            />
          </Table>
          <Create_Edit
            visible={visible}
            showModal={showModal}
            data={data}
            view={view}
            setView={setView}
          />
          <DeletePopup
            isDelete={isDelete}
            setOpenDelete={setOpenDelete}
            id={cssId}
          />

          <Pagination
            current={currentPage}
            className={'patient-paging'}
            total={categories.length}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`}
            showQuickJumper
            showSizeChanger
          />
        </div>
      </Spin>
    </Main>
  );
};

PatientList.defaultProps = {
  categories: []
};

PatientList.propTypes = {
  categories: T.array,
};

const mapState = (state) => ({
  isLoadingCategory: state.vitalSigns.isLoadingCategory,
  categories: state.vitalSigns.categories,
});

const mapDispatch = ({
  vitalSigns: { getAllCategory },
  department: { getAllDepartments },
}) => ({
  getAllCategory,
  getAllDepartments,
});

export default connect(mapState, mapDispatch)(PatientList);
