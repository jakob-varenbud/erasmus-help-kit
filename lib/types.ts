export type MapPoint = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  /** Side of the pin where the label is shown (to avoid overlapping labels). */
  labelDir?: "left" | "right" | "top" | "bottom";
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
  lat: number;
  lng: number;
  walkIn: boolean;
  labelDir?: MapPoint["labelDir"];
  avoid?: string;
};

export type EventItem = {
  id: string;
  title: string;
  organizer: "Nova FCT" | "ESN" | "Other";
  date: string; // ISO date (yyyy-mm-dd)
  time: string;
  place: string;
  lat: number;
  lng: number;
  price: string;
  description: string;
  weekend?: "this" | "next"; // filled in by the mock API
};
