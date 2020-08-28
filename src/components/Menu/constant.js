import CategoryIcon from "assets/svg/category.svg";
import MedicineIcon from "assets/svg/medicine.svg";
import TreatmentIcon from "assets/svg/treatment.svg";

export const menu = {
  treatment: {
    name: "menu.treatment",
    link: "/app/patient-list",
    icon: TreatmentIcon,
  },
  groupDistribution: {
    group: true,
    name: "menu.manageMedicine",
    icon: MedicineIcon,
    drugDistribution: {
      name: "menu.medicinePlan",
      link: "/drug-distribution",
    },
    drugAllocation: {
      name: "menu.medicineDistribution",
      link: "/drug-allocation",
    },
  },
  categories: {
    group: true,
    icon: CategoryIcon,
    name: "menu.categories",
    lifePoint: {
      name: "menu.lifePoint",
      link: "/servival-index",
    },
    formCategory: {
      name: "menu.formCategory",
      link: "/form-catalog",
      accessRoles: ['ROLE_IsofhAdmin', 'ROLE_IsofhUser']
    },
    medicalRecord: {
      name: "menu.manageMedicalRecord",
      link: "/medical-record",
      accessRoles: ['ROLE_IsofhAdmin', 'ROLE_IsofhUser']
    },
  },
  scan: {
    name: "Scan",
    link: "/scan",
    icon: '',
    iconType: "scan",
  },
  config: {
    icon: "",
    iconType: "setting",
    group: true,
    name: "menu.config",
    room: {
      name: "menu.room",
      link: "/patientRoom",
    },
  },
};

export const checkRole = (accessRoles, roles) => {
  if (!accessRoles || accessRoles.length < 1) {
    return true;
  }

  return accessRoles.map(rA => roles.includes(rA)).filter(b => !b).length < 1;
};
