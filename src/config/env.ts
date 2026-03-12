const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const fallbackApiUrl = "http://10.0.2.2:3000";

export const env = {
  apiUrl: trimTrailingSlash(process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl),
};

