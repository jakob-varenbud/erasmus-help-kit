// All data below is mock data for the prototype – there is no real backend.
import type { Accommodation, Course, EventItem, MapPoint, Office } from "./types";

/* ---------- Campus (Nova FCT, Caparica) – building positions are approximate ---------- */

export const CAMPUS = { lat: 38.6610, lng: -9.2048 };

export const campusBuildings: MapPoint[] = [
  { id: "ed1", label: "Ed. I", lat: 38.6612, lng: -9.2052 },
  { id: "ed2", label: "Ed. II", lat: 38.6606, lng: -9.203 },
  { id: "ed4", label: "Ed. IV", lat: 38.6631, lng: -9.2066 },
  { id: "ed7", label: "Ed. VII", lat: 38.6597, lng: -9.2047 },
  { id: "ed8", label: "Ed. VIII", lat: 38.6594, lng: -9.2059 },
  { id: "ed9", label: "Ed. IX", lat: 38.6591, lng: -9.207 },
  { id: "ed10", label: "Ed. X", lat: 38.6599, lng: -9.2035 },
  { id: "library", label: "Library", lat: 38.6619, lng: -9.2046 },
  { id: "canteen", label: "Canteen", lat: 38.6612, lng: -9.2038 },
  { id: "dep", label: "Dep.", lat: 38.6621, lng: -9.2075 },
  { id: "sea", label: "SEA", lat: 38.662, lng: -9.2057 },
];

export const courses: Course[] = [
  { id: "c1", code: "KR", name: "Knowledge Representation", ects: 6, language: "English", level: "Master", semester: "Winter", department: "Computer Science", building: "ed2", description: "Logic-based representation of knowledge and automated reasoning." },
  { id: "c2", code: "HCI", name: "Human Computer Interaction", ects: 6, language: "English", level: "Bachelor", semester: "Winter", department: "Computer Science", building: "ed2", description: "User-centred design, prototyping and usability evaluation." },
  { id: "c3", code: "DS", name: "Distributed Systems", ects: 6, language: "English", level: "Bachelor", semester: "Winter", department: "Computer Science", building: "ed2", description: "Communication, replication and consistency in distributed systems." },
  { id: "c4", code: "CV", name: "Computer Vision", ects: 6, language: "English", level: "Master", semester: "Winter", department: "Computer Science", building: "ed2", description: "Image processing, feature detection and deep learning for vision." },
  { id: "c5", code: "ERG", name: "Ergonomics", ects: 6, language: "English", level: "Bachelor", semester: "Winter", department: "Industrial Engineering", building: "ed7", description: "Human factors in the design of products and workplaces." },
  { id: "c6", code: "DB", name: "Databases", ects: 6, language: "English", level: "Bachelor", semester: "Winter", department: "Computer Science", building: "ed2", description: "Relational model, SQL, transactions and query optimisation." },
  { id: "c7", code: "SE", name: "Software Engineering", ects: 6, language: "English", level: "Bachelor", semester: "Winter", department: "Computer Science", building: "ed2", description: "Requirements, design, testing and agile teamwork." },
  { id: "c8", code: "ML", name: "Machine Learning", ects: 6, language: "English", level: "Master", semester: "Summer", department: "Computer Science", building: "ed2", description: "Supervised and unsupervised learning methods." },
  { id: "c9", code: "AED", name: "Algoritmos e Estruturas de Dados", ects: 6, language: "Portuguese", level: "Bachelor", semester: "Winter", department: "Computer Science", building: "ed2", description: "Algorithms and data structures (taught in Portuguese)." },
  { id: "c10", code: "CAL", name: "Cálculo II", ects: 6, language: "Portuguese", level: "Bachelor", semester: "Winter", department: "Mathematics", building: "ed1", description: "Multivariable calculus (taught in Portuguese)." },
  { id: "c11", code: "ENV", name: "Environmental Management", ects: 3, language: "English", level: "Bachelor", semester: "Winter", department: "Environmental Sciences", building: "ed8", description: "Introduction to environmental management systems." },
  { id: "c12", code: "PT", name: "Portuguese for Foreigners A1", ects: 3, language: "English", level: "Bachelor", semester: "Winter", department: "Languages", building: "ed7", description: "Beginner Portuguese course for exchange students." },
  { id: "c13", code: "IR", name: "Information Retrieval", ects: 6, language: "English", level: "Master", semester: "Winter", department: "Computer Science", building: "ed2", description: "Search engines, indexing and ranking." },
  { id: "c14", code: "MAT", name: "Materials Science", ects: 6, language: "Portuguese", level: "Master", semester: "Summer", department: "Materials", building: "ed9", description: "Structure and properties of materials (taught in Portuguese)." },
];

/* ---------- Lisbon (schematic map) ---------- */

export const lisbonAreas: (MapPoint & { info: string; safety: string; priceLevel: string; commute: string })[] = [
  { id: "almada", label: "Almada", lat: 38.679, lng: -9.1569, info: "Right next to the campus, quieter and cheaper than Lisbon centre.", safety: "Safe", priceLevel: "€", commute: "15–25 min (tram MTS)" },
  { id: "caparica", label: "Caparica", lat: 38.664, lng: -9.201, info: "Closest to Nova FCT and the beach. Few shops, quiet at night.", safety: "Safe", priceLevel: "€", commute: "5–10 min" },
  { id: "baixa", labelDir: "bottom", label: "Baixa / Chiado", lat: 38.711, lng: -9.139, info: "Historic centre, lively and touristy, expensive.", safety: "Mostly safe, watch for pickpockets", priceLevel: "€€€", commute: "40–50 min (ferry + tram)" },
  { id: "bairro-alto", labelDir: "left", label: "Bairro Alto", lat: 38.7135, lng: -9.146, info: "Nightlife district, can be loud at night.", safety: "OK, busy at night", priceLevel: "€€", commute: "45–55 min" },
  { id: "alfama", labelDir: "right", label: "Alfama", lat: 38.7118, lng: -9.13, info: "Old town with narrow streets and many short-term rentals.", safety: "Mostly safe", priceLevel: "€€", commute: "45–55 min" },
  { id: "arroios", label: "Arroios", lat: 38.733, lng: -9.135, info: "Popular with students, many shared flats.", safety: "Safe", priceLevel: "€€", commute: "50–60 min (metro + ferry)" },
  { id: "odivelas", label: "Odivelas", lat: 38.793, lng: -9.183, info: "North of Lisbon, cheaper but long commute.", safety: "Safe", priceLevel: "€", commute: "70+ min" },
];

export const accommodations: Accommodation[] = [
  { id: "a1", title: "Room in shared flat near the tram", area: "almada", type: "Room", price: 420, verifiedLandlord: true, legalContract: true, minutesToCampus: 20, source: "Uniplaces", description: "Bright room in a flat with 3 other students. Bills included, registered contract." },
  { id: "a2", title: "Student room 5 min from campus", area: "caparica", type: "Room", price: 380, verifiedLandlord: true, legalContract: true, minutesToCampus: 7, source: "Nova FCT housing list", description: "Simple furnished room, shared kitchen. Landlord verified by previous Erasmus students." },
  { id: "a3", title: "Studio in Chiado", area: "baixa", type: "Studio", price: 950, verifiedLandlord: true, legalContract: true, minutesToCampus: 45, source: "Spotahome", description: "Small renovated studio in the city centre." },
  { id: "a4", title: "Cheap room in Bairro Alto", area: "bairro-alto", type: "Room", price: 350, verifiedLandlord: false, legalContract: false, minutesToCampus: 50, source: "Facebook group", description: "Owner asks for deposit via transfer before viewing – typical scam warning sign." },
  { id: "a5", title: "Room in student house", area: "arroios", type: "Room", price: 480, verifiedLandlord: true, legalContract: true, minutesToCampus: 55, source: "HousingAnywhere", description: "Large student house with 8 rooms, cleaning included." },
  { id: "a6", title: "Room with balcony", area: "almada", type: "Room", price: 450, verifiedLandlord: true, legalContract: false, minutesToCampus: 18, source: "Idealista", description: "Nice room, but landlord only offers an informal agreement." },
  { id: "a7", title: "Room in Alfama", area: "alfama", type: "Room", price: 520, verifiedLandlord: true, legalContract: true, minutesToCampus: 50, source: "Uniplaces", description: "Traditional building, shared with 2 people." },
  { id: "a8", title: "Apartment for 2 in Odivelas", area: "odivelas", type: "Apartment", price: 400, verifiedLandlord: false, legalContract: true, minutesToCampus: 75, source: "OLX", description: "Price per person. Long commute to campus." },
];

export const trustedWebsites = [
  { name: "Uniplaces", url: "https://www.uniplaces.com" },
  { name: "HousingAnywhere", url: "https://housinganywhere.com" },
  { name: "Spotahome", url: "https://www.spotahome.com" },
];

export const commonScams = [
  "Landlord asks for a deposit before you can see the room (in person or via video call).",
  "Price is much lower than similar rooms in the same area.",
  "Landlord is 'abroad' and will send the keys by post.",
  "Payment only via Western Union, crypto or gift cards.",
  "No contract or contract not registered at Finanças.",
];

export const contractChecklist = [
  "Full names and NIF of landlord and tenant",
  "Address of the property and description of the room",
  "Monthly rent, deposit and what is included (bills, internet)",
  "Start and end date, notice period",
  "Contract registered at Finanças (ask for the receipt)",
];

/* ---------- NIF ---------- */

export const offices: Office[] = [
  { id: "o8", name: "Finanças Lisboa 8", address: "Rua Morais Soares 64 (mock)", area: "arroios", lat: 38.737, lng: -9.133, walkIn: true },
  { id: "o6", labelDir: "left", name: "Finanças Lisboa 6", address: "Av. Infante Santo 2 (mock)", area: "bairro-alto", lat: 38.709, lng: -9.164, walkIn: true },
  { id: "o4", labelDir: "bottom", name: "Finanças Lisboa 4", address: "Rua do Comércio 12 (mock)", area: "baixa", lat: 38.709, lng: -9.1365, walkIn: true },
  { id: "oa", name: "Finanças Almada 1", address: "Praça São João Baptista (mock)", area: "almada", lat: 38.6795, lng: -9.158, walkIn: true },
  { id: "o1", labelDir: "left", name: "Finanças Lisboa 1", address: "Rua Castilho 5 (mock)", area: "arroios", lat: 38.723, lng: -9.155, walkIn: false, avoid: "Very long queues, usually fully booked." },
  { id: "o3", labelDir: "right", name: "Finanças Lisboa 3", address: "Rua de Alfama 20 (mock)", area: "alfama", lat: 38.7122, lng: -9.129, walkIn: false, avoid: "Often refuses foreign students without appointment." },
];

export const naveganteOffices: MapPoint[] = [
  { id: "n1", label: "Metropolitano de Lisboa – Marquês de Pombal", lat: 38.7253, lng: -9.15 },
  { id: "n2", label: "Metropolitano de Lisboa – Cais do Sodré", lat: 38.706, lng: -9.1445 },
];

/* ---------- Events (dates are relative to today, so “next weekend” always works) ---------- */

function upcomingSaturday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 6 ? 0 : day === 0 ? -1 : 6 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function iso(d: Date, addDays = 0): string {
  const x = new Date(d);
  x.setDate(x.getDate() + addDays);
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${x.getFullYear()}-${m}-${day}`;
}

export function buildEvents(today = new Date()): EventItem[] {
  const sat = upcomingSaturday(today);
  const thisWeekend = [iso(sat), iso(sat, 1)];
  const nextWeekend = [iso(sat, 7), iso(sat, 8)];
  const list: EventItem[] = [
    { id: "e1", title: "Erasmus Welcome Gathering", organizer: "Nova FCT", date: iso(sat), time: "17:00", place: "Nova FCT Campus – Canteen", lat: 38.6612, lng: -9.2038, price: "Free", description: "Meet other exchange students, snacks and drinks provided by the International Office." },
    { id: "e2", title: "Guided City Tour – Old Lisbon", organizer: "ESN", date: iso(sat), time: "10:00", place: "Praça do Comércio", lat: 38.7075, lng: -9.1365, price: "5 €", description: "2-hour walking tour through Baixa, Chiado and Alfama with a local guide. Slow pace, accessible route." },
    { id: "e3", title: "Picnic at Caparica Beach", organizer: "ESN", date: iso(sat, 1), time: "12:00", place: "Costa da Caparica", lat: 38.643, lng: -9.238, price: "Free", description: "Bring food to share, games and beach volleyball." },
    { id: "e4", title: "Get to Know Lisbon – Quiz Night", organizer: "ESN", date: iso(sat, -2), time: "21:00", place: "Bairro Alto", lat: 38.7135, lng: -9.146, price: "3 €", description: "Pub quiz about Portugal in mixed teams." },
    { id: "e5", title: "Nova FCT Sports Day", organizer: "Nova FCT", date: iso(sat, 7), time: "10:00", place: "Nova FCT Sports Hall", lat: 38.6627, lng: -9.2028, price: "Free", description: "Football, basketball and volleyball tournaments for all students." },
    { id: "e6", title: "Fado Evening", organizer: "Other", date: iso(sat, 7), time: "20:30", place: "Alfama", lat: 38.7118, lng: -9.13, price: "15 €", description: "Traditional Portuguese music in a small tavern." },
    { id: "e7", title: "Day Trip to Sintra", organizer: "ESN", date: iso(sat, 8), time: "08:30", place: "Rossio Station", lat: 38.7142, lng: -9.141, price: "25 €", description: "Visit palaces and gardens of Sintra. Train tickets included." },
    { id: "e8", title: "Language Exchange Tandem", organizer: "Nova FCT", date: iso(sat, 3), time: "18:00", place: "Nova FCT Library", lat: 38.6619, lng: -9.2046, price: "Free", description: "Practice Portuguese and help locals with your language." },
  ];
  return list.map((e) => ({
    ...e,
    weekend: thisWeekend.includes(e.date) ? "this" : nextWeekend.includes(e.date) ? "next" : undefined,
  }));
}
