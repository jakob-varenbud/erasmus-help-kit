export type MapPoint = {
  id: string;
  label: string;
  x: number; // 0–100, position on the map
  y: number; // 0–100
};

export type Course = {
  id: string;
  code: string;
  name: string;
  ects: number;
  language: "English" | "Portuguese";
  level: "Bachelor" | "Master";
  semester: "Winter" | "Summer";
  department: string;
  building: string; // id of a campus building
  description: string;
};

export type Accommodation = {
  id: string;
  title: string;
  area: string; // id of a Lisbon area
  type: "Room" | "Studio" | "Apartment";
  price: number; // € per month
  verifiedLandlord: boolean;
  legalContract: boolean;
  minutesToCampus: number;
  source: string;
  description: string;
};

export type Office = {
  id: string;
  name: string;
  address: string;
  area: string;
  x: number;
  y: number;
  walkIn: boolean;
  avoid?: string;
};

export type EventItem = {
  id: string;
  title: string;
  organizer: "Nova FCT" | "ESN" | "Other";
  date: string; // ISO date (yyyy-mm-dd)
  time: string;
  place: string;
  x: number;
  y: number;
  price: string;
  description: string;
  weekend?: "this" | "next"; // filled in by the mock API
};
