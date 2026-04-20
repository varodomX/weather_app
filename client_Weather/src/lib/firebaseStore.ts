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

const getPageStorageKey = (pageKey: string) =>
  `weather-app:${getCurrentUserKey()}:pages:${pageKey}`;

export const loadPageState = async <T>(pageKey: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  const savedValue = window.localStorage.getItem(getPageStorageKey(pageKey));

  if (!savedValue) {
    return null;
  }

  return JSON.parse(savedValue) as T;
};

export const savePageState = async <T>(pageKey: string, data: T) => {
  if (typeof window === "undefined") {
    return data;
  }

  window.localStorage.setItem(getPageStorageKey(pageKey), JSON.stringify(data));

  return data;
};
