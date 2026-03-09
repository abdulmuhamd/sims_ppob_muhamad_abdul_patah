import { DEFAULT_PROFILE, LOCAL_BANNERS, SERVICE_ICON_MAP } from "../constants/assets";

export function resolveProfileImage(url) {
  if (!url) return DEFAULT_PROFILE;
  const raw = String(url).trim().toLowerCase();
  if (!raw || raw.includes("null")) return DEFAULT_PROFILE;
  return url;
}

export function resolveServiceIcon(service) {
  return SERVICE_ICON_MAP[service.service_code] || service.service_icon;
}

export function resolveBannerImage(index, fallback) {
  return LOCAL_BANNERS[index] || fallback;
}
