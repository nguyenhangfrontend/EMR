import CNSIcon from "assets/svg/cns.svg";
import HSDDIcon from "assets/svg/hsdd.svg";
import HSBAIcon from "assets/svg/hsba.svg";
import PTTTIcon from "assets/svg/pt.svg";
import YlenhIcon from "assets/svg/ylenh.svg";

export const applications = [
  { name: "CNS", link: '/app/vital-signs', icon: CNSIcon, display: ["110", "DHY", "MAT"] },
  { name: "HSBA", link: '/app/files', icon: HSBAIcon, display: ["MAT", "DHY", '110'] },
  { name: "PTTT", link: '/app/phau-thuat-thu-thuat', icon: PTTTIcon, display: [] },
  { name: "Y lệnh", link: '/app/y-lenh', icon: YlenhIcon, display: [] },
];