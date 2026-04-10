const firebaseConfig = {
  apiKey: "AIzaSyA1abm9gVOOLPyyaL0-rQ2jODWBaVQZA5o",
  authDomain: "une-wfh.firebaseapp.com",
  databaseURL:
    "https://une-wfh-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "une-wfh",
  storageBucket: "une-wfh.firebasestorage.app",
  messagingSenderId: "972608189061",
  appId: "1:972608189061:web:f09f64aa659abb27f66fec",
};

const sanitizeKey = (value: string) =>
  value.replace(/[.#$/\[\]]/g, "_").trim() || "guest";

const getCurrentUserKey = () => {
  if (typeof window === "undefined") {
    return "guest";
  }

  return sanitizeKey(
    window.localStorage.getItem("auth-name") ||
      window.localStorage.getItem("token") ||
      "guest",
  );
};

const getPageUrl = (pageKey: string) =>
  `${firebaseConfig.databaseURL}/users/${getCurrentUserKey()}/pages/${pageKey}.json`;

export const loadPageState = async <T>(pageKey: string) => {
  const response = await fetch(getPageUrl(pageKey));

  if (!response.ok) {
    throw new Error(`Failed to load ${pageKey} state`);
  }

  return (await response.json()) as T | null;
};

export const savePageState = async <T>(pageKey: string, data: T) => {
  const response = await fetch(getPageUrl(pageKey), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to save ${pageKey} state`);
  }

  return response.json();
};
