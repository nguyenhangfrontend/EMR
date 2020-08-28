import React, { Suspense } from "react";

import PageWrapper from 'components/PageWrapper';

const Creation = React.lazy(() => import("./config"));
const PatientList = React.lazy(() => import("./patients"));
const Forms = React.lazy(() => import("./files"));
const CreateDoc = React.lazy(() => import("./createDoc"));
const PatientRoomMangement = React.lazy(() => import("./patientRoomMangement"));
const Documents = React.lazy(() => import("pages/documents"));
const Permission = React.lazy(() => import("./permission"));
const Role = React.lazy(() => import("./roles"));
const VitalSigns = React.lazy(() => import("./vital-signs"));
const DrugDistributions = React.lazy(() => import("./drug-allocation/distribution"));
const DrugAllocation = React.lazy(() => import("./drug-allocation/allocation"));
const Therapy = React.lazy(() => import("./therapy"));
const VitalSignPrint = React.lazy(() => import("./vital-signs/VitalSignPrint"));
const ServivalIndex = React.lazy(() => import("./servivalIndex"));
const FormCatalog = React.lazy(() => import("./formCatalog"));
const MedicalRecord = React.lazy(() => import("./medicalRecord"));
const Scan = React.lazy(() => import("./scan"));

function createDoc(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <CreateDoc {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function documents(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <Documents {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function creation(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <Creation {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function files(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <Forms {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function patients(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <PatientList {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function drugDistributions(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <DrugDistributions {...props} />
    </Suspense>
  );
}
function clinicManagement(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <PatientRoomMangement {...props} />
      </PageWrapper>
    </Suspense>
  );
}
function permission(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <Permission {...props} />
      </PageWrapper>
    </Suspense>
  );
}
function servivalIndex(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <ServivalIndex {...props} />
    </Suspense>
  );
}
function role(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <Role {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function vitalSigns(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <VitalSigns {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function drugAllocation(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <DrugAllocation {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function therapy(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <Therapy {...props} />
    </Suspense>
  );
}

function vitalSignPrint(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <VitalSignPrint {...props} />
      </PageWrapper>
    </Suspense>
  );
}

function formCatalog(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper accessRoles={['ROLE_IsofhAdmin', 'ROLE_IsofhUser']}>
        <FormCatalog {...props} />
      </PageWrapper>
    </Suspense>
  );
}
function medicalRecord(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper accessRoles={['ROLE_IsofhAdmin', 'ROLE_IsofhUser']}>
        <MedicalRecord {...props} />
      </PageWrapper>
    </Suspense>
  );
}
function scan(props) {
  return (
    <Suspense fallback={<div>{"loading..."}</div>}>
      <PageWrapper>
        <Scan {...props} />
      </PageWrapper>
    </Suspense>
  );
}

const therapyPages = {
  files: {
    component: files,
    accessRoles: [],
    path: '/app/files/:patientDocument',
    exact: false,
  },
  patients: {
    component: patients,
    accessRoles: [],
    path: '/app/patient-list',
    exact: true,
  },
  patientFocus: {
    component: patients,
    accessRoles: [],
    path: '/app/patient-list/:patientDocument',
    exact: false,
  },
  vitalSigns: {
    component: vitalSigns,
    accessRoles: [],
    path: '/app/vital-signs/:patientDocument',
    exact: false,
  },
};

const pages = {
  creation: {
    component: creation,
    accessRoles: [],
    path: '/config/:formId',
    exact: true,
  },
  files: {
    component: files,
    accessRoles: [],
    path: '/files/:patientDocument',
    exact: false,
  },
  createDoc: {
    component: createDoc,
    accessRoles: [],
    path: '/createDoc',
    exact: true,
  },
  drugDistributions: {
    component: drugDistributions,
    accessRoles: [],
    path: '/drug-distribution',
    exact: false,
  },
  clinicManagement: {
    component: clinicManagement,
    accessRoles: [],
    path: '/patientRoom',
    exact: false,
  },
  documents: {
    component: documents,
    accessRoles: [],
    path: '/config',
    exact: true,
  },
  permission: {
    component: permission,
    accessRoles: [],
    path: '/permission',
    exact: false,
  },
  role: {
    component: role,
    accessRoles: [],
    path: '/roles',
    exact: false,
  },
  therapy: {
    component: therapy,
    accessRoles: [],
    path: '/app',
    exact: false,
  },
  drugAllocation: {
    component: drugAllocation,
    accessRoles: [],
    path: '/drug-allocation',
    exact: false,
  },
  vitalSigns: {
    component: vitalSigns,
    accessRoles: [],
    path: '/vital-signs/:patientDocument',
    exact: false,
  },
  servivalIndex: {
    component: servivalIndex,
    accessRoles: [],
    path: '/servival-index',
    exact: false,
  },
  formCatalog: {
    component: formCatalog,
    accessRoles: ['ROLE_IsofhAdmin', 'ROLE_IsofhUser'],
    path: '/form-catalog',
    exact: false,
  },
  medicalRecord: {
    component: medicalRecord,
    accessRoles: ['ROLE_IsofhAdmin', 'ROLE_IsofhUser'],
    path: '/medical-record',
    exact: false,
  },
  scan: {
    component: scan,
    accessRoles: [],
    path: '/scan',
    exact: false,
  }
};

export { pages, therapyPages, vitalSignPrint };
