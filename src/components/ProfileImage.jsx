import { useState } from "react";
import { DEFAULT_PROFILE } from "../constants/assets";
import { resolveProfileImage } from "../utils/assetResolvers";

export default function ProfileImage({ src, className, alt = "Profile" }) {
  const [failed, setFailed] = useState(false);
  const finalSrc = failed ? DEFAULT_PROFILE : resolveProfileImage(src);
  return <img src={finalSrc} alt={alt} className={className} onError={() => setFailed(true)} />;
}
