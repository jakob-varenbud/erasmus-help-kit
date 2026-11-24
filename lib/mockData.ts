// All data below is mock data for the prototype – there is no real backend.
import type { Accommodation, Course, EventItem, MapPoint, Office } from "./types";

/* ---------- Campus (Nova FCT, Caparica) ---------- */

export const campusBuildings: (MapPoint & { w: number; h: number })[] = [
  { id: "ed1", label: "Ed. I", x: 40, y: 50, w: 14, h: 10 },
  { id: "ed2", label: "Ed. II", x: 70, y: 62, w: 12, h: 14 },
  { id: "ed4", label: "Ed. IV", x: 22, y: 12, w: 10, h: 8 },
  { id: "ed7", label: "Ed. VII", x: 38, y: 74, w: 14, h: 12 },
  { id: "ed8", label: "Ed. VIII", x: 22, y: 74, w: 8, h: 14 },
  { id: "ed9", label: "Ed. IX", x: 10, y: 74, w: 8, h: 14 },
  { id: "ed10", label: "Ed. X", x: 58, y: 76, w: 8, h: 12 },
  { id: "library", label: "Library", x: 56, y: 28, w: 18, h: 8 },
  { id: "canteen", label: "Canteen", x: 62, y: 46, w: 14, h: 8 },
  { id: "dep", label: "Dep.", x: 8, y: 30, w: 8, h: 18 },
  { id: "sea", label: "SEA", x: 40, y: 34, w: 10, h: 8 },
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
  { id: "almada", label: "Almada", x: 44, y: 64, info: "Right next to the campus, quieter and cheaper than Lisbon centre.", safety: "Safe", priceLevel: "€", commute: "15–25 min (tram MTS)" },
  { id: "caparica", label: "Caparica", x: 22, y: 84, info: "Closest to Nova FCT and the beach. Few shops, quiet at night.", safety: "Safe", priceLevel: "€", commute: "5–10 min" },
  { id: "baixa", label: "Baixa / Chiado", x: 50, y: 36, info: "Historic centre, lively and touristy, expensive.", safety: "Mostly safe, watch for pickpockets", priceLevel: "€€€", commute: "40–50 min (ferry + tram)" },
  { id: "bairro-alto", label: "Bairro Alto", x: 42, y: 32, info: "Nightlife district, can be loud at night.", safety: "OK, busy at night", priceLevel: "€€", commute: "45–55 min" },
  { id: "alfama", label: "Alfama", x: 60, y: 30, info: "Old town with narrow streets and many short-term rentals.", safety: "Mostly safe", priceLevel: "€€", commute: "45–55 min" },
  { id: "arroios", label: "Arroios", x: 56, y: 18, info: "Popular with students, many shared flats.", safety: "Safe", priceLevel: "€€", commute: "50–60 min (metro + ferry)" },
  { id: "odivelas", label: "Odivelas", x: 46, y: 6, info: "North of Lisbon, cheaper but long commute.", safety: "Safe", priceLevel: "€", commute: "70+ min" },
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
  { id: "o8", name: "Finanças Lisboa 8", address: "Rua Morais Soares 64 (mock)", area: "arroios", x: 58, y: 20, walkIn: true },
  { id: "o6", name: "Finanças Lisboa 6", address: "Av. Infante Santo 2 (mock)", area: "bairro-alto", x: 36, y: 38, walkIn: true },
  { id: "o4", name: "Finanças Lisboa 4", address: "Rua do Comércio 12 (mock)", area: "baixa", x: 52, y: 38, walkIn: true },
  { id: "oa", name: "Finanças Almada 1", address: "Praça São João Baptista (mock)", area: "almada", x: 46, y: 60, walkIn: true },
  { id: "o1", name: "Finanças Lisboa 1", address: "Rua Castilho 5 (mock)", area: "arroios", x: 48, y: 22, walkIn: false, avoid: "Very long queues, usually fully booked." },
  { id: "o3", name: "Finanças Lisboa 3", address: "Rua de Alfama 20 (mock)", area: "alfama", x: 62, y: 32, walkIn: false, avoid: "Often refuses foreign students without appointment." },
];

export const naveganteOffices: MapPoint[] = [
  { id: "n1", label: "Metropolitano de Lisboa – Marquês de Pombal", x: 46, y: 26 },
  { id: "n2", label: "Metropolitano de Lisboa – Cais do Sodré", x: 46, y: 40 },
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
    { id: "e1", title: "Erasmus Welcome Gathering", organizer: "Nova FCT", date: iso(sat), time: "17:00", place: "Nova FCT Campus – Canteen", x: 22, y: 82, price: "Free", description: "Meet other exchange students, snacks and drinks provided by the International Office." },
    { id: "e2", title: "Guided City Tour – Old Lisbon", organizer: "ESN", date: iso(sat), time: "10:00", place: "Praça do Comércio", x: 52, y: 38, price: "5 €", description: "2-hour walking tour through Baixa, Chiado and Alfama with a local guide. Slow pace, accessible route." },
    { id: "e3", title: "Picnic at Caparica Beach", organizer: "ESN", date: iso(sat, 1), time: "12:00", place: "Costa da Caparica", x: 14, y: 76, price: "Free", description: "Bring food to share, games and beach volleyball." },
    { id: "e4", title: "Get to Know Lisbon – Quiz Night", organizer: "ESN", date: iso(sat, -2), time: "21:00", place: "Bairro Alto", x: 42, y: 32, price: "3 €", description: "Pub quiz about Portugal in mixed teams." },
    { id: "e5", title: "Nova FCT Sports Day", organizer: "Nova FCT", date: iso(sat, 7), time: "10:00", place: "Nova FCT Sports Hall", x: 26, y: 86, price: "Free", description: "Football, basketball and volleyball tournaments for all students." },
    { id: "e6", title: "Fado Evening", organizer: "Other", date: iso(sat, 7), time: "20:30", place: "Alfama", x: 60, y: 30, price: "15 €", description: "Traditional Portuguese music in a small tavern." },
    { id: "e7", title: "Day Trip to Sintra", organizer: "ESN", date: iso(sat, 8), time: "08:30", place: "Rossio Station", x: 50, y: 34, price: "25 €", description: "Visit palaces and gardens of Sintra. Train tickets included." },
    { id: "e8", title: "Language Exchange Tandem", organizer: "Nova FCT", date: iso(sat, 3), time: "18:00", place: "Nova FCT Library", x: 24, y: 80, price: "Free", description: "Practice Portuguese and help locals with your language." },
  ];
  return list.map((e) => ({
    ...e,
    weekend: thisWeekend.includes(e.date) ? "this" : nextWeekend.includes(e.date) ? "next" : undefined,
  }));
}
