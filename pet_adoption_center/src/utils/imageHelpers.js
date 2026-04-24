import { DEFAULT_PROFILE_IMAGE } from "../constants/defaultImages";

export const getProfileImageSrc = (value) => {
  if (!value) return DEFAULT_PROFILE_IMAGE;
  if (typeof value !== "string") return DEFAULT_PROFILE_IMAGE;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `http://localhost:5000/uploads/${value}`;
};

export const getOptionalImageSrc = (value) => {
  if (!value || typeof value !== "string") return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `http://localhost:5000/uploads/${value}`;
};
