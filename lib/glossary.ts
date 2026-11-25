// Short explanations for terms that confused test users (e.g. "Online Learning Agreement").
export const glossary = {
  "learning-agreement": {
    term: "Learning Agreement",
    text: "The contract between you, your home university and Nova FCT that lists the courses you will take abroad. All three sides must sign it before your exchange starts.",
  },
  ola: {
    term: "Online Learning Agreement (OLA)",
    text: "The digital version of the Learning Agreement. You fill it in on learning-agreement.eu, then your home coordinator and Nova FCT sign it online.",
  },
  ects: {
    term: "ECTS",
    text: "European credit points. One semester of full-time study is usually 30 ECTS. Your home university tells you how many you need.",
  },
  nif: {
    term: "NIF",
    text: "Número de Identificação Fiscal – your Portuguese tax number. You need it for a bank account, a rental contract, a phone contract and the Navegante pass.",
  },
  financas: {
    term: "Finanças",
    text: "The Portuguese tax office. This is where you get your NIF in person.",
  },
  navegante: {
    term: "Navegante",
    text: "The public transport pass for Lisbon (metro, bus, tram, ferry). Free for students up to 23.",
  },
  esn: {
    term: "ESN",
    text: "Erasmus Student Network – a student association that organises trips, parties and city tours for exchange students.",
  },
  "fiscal-representative": {
    term: "Fiscal representative",
    text: "A person or company with a Portuguese address who receives tax letters for you. Non-EU citizens need one if they do not yet have a Portuguese address.",
  },
  "proof-of-address": {
    term: "Proof of address",
    text: "A document that shows where you live, e.g. your rental contract or a letter from Nova FCT.",
  },
} as const;

export type GlossaryKey = keyof typeof glossary;
