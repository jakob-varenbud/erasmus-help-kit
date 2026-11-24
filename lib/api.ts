"use client";

// Mock API – imitates calls to a backend. Replace these functions with real fetch() calls later.
import { useEffect, useState } from "react";
import * as db from "./mockData";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async getCourses() {
    await delay();
    return db.courses;
  },
  async getAccommodations() {
    await delay();
    return db.accommodations;
  },
  async getOffices() {
    await delay();
    return db.offices;
  },
  async getEvents() {
    await delay();
    return db.buildEvents(new Date());
  },
};

/** Small hook: loads data from the mock API on the client. */
export function useApi<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let alive = true;
    loader().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, loading: data === null };
}

/** useState that is saved in localStorage (e.g. "My courses"). */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, loaded]);
  return [value, setValue] as const;
}
