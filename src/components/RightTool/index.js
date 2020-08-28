import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Icon } from "antd";
import PatientInfo from "components/Patient";
import SearchRightSide from "./SearchRightSide";
import { applications } from "./constants";
import { Main } from "./styled";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import CollapseLayout from 'components/RightTool/CollapsedLayout';


const RightTool = ({ info, initUrl, treatment, collapse }) => {
  const { url } = treatment;
  const params = useParams();
  const [urlLocal, setUrl] = useState("/app/vital-signs");
  const [appCurrent, setAppCurrent] = useState('');
  const [localApps, setLocalApp] = useState([]);

  useEffect(()=> {
    const apps = applications.filter(item => item.display.includes(process.env.REACT_APP_APP));

    setLocalApp(apps)
  }, []);

  useEffect(() => {
    let link;

    if (window.location.pathname.includes("app/patient-list") && !url) {
      link = `/app/vital-signs/${info?.maHoSo}`;
    } else if (window.location.pathname.includes("app/patient-list") && url) {
      link = url;
    } else {
      link = window.location.pathname;
    }

    initUrl(link);
    setUrl(link);

    applications.forEach(item => {
      if (link.includes(item.link)) {
        setAppCurrent(item.name);
      }
    })

  }, [params]);

  if (collapse) {
    return <CollapseLayout localApps={localApps} appCurrent={appCurrent} info={info} />
  }

  return (
    <Main>
      <div className="sidebar-inner">
        {!window.location.pathname.includes("app/patient-list") && (
          <SearchRightSide />
        )}

        <PatientInfo />

        <div>
          {info && (
            <Card size={"small"} bordered={false} title={"Chức năng"}>
              <Row gutter={[12, 12]}>
                {localApps.map((item, index) => {
                  return (
                    <Col span={6} key={index}>
                      <Link
                        to={`${item.link}/${info?.maHoSo}`}
                        title={item.name}
                      >
                        <div className={`menu-app-item ${urlLocal.includes(`${item.link}`) ? "selected" : ""}`}>
                          <span className="icon-app">
                            <Icon component={item.icon} />
                          </span>

                          <span className="text-app">{item.name}</span>
                        </div>
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          )}
        </div>
      </div>
    </Main>
  );
};
const mapState = (state) => ({
  info: state.patient.info,
  treatment: state.treatment,
});

const mapDispatch = ({ treatment: { initUrl } }) => ({ initUrl });

export default connect(mapState, mapDispatch)(RightTool);
