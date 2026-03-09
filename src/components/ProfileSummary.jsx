import { useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";

export default function ProfileSummary() {
  const profile = useSelector((state) => state.ppob.profile);

  return (
    <article className="profile-summary">
      <ProfileImage src={profile.profile_image} />
      <p>Selamat datang,</p>
      <h2>
        {profile.first_name} {profile.last_name}
      </h2>
    </article>
  );
}
