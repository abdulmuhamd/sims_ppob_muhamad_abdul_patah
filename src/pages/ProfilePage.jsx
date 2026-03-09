import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileImage from "../components/ProfileImage";
import { clearAuth } from "../store/authSlice";
import { fetchProfile, updateProfile, uploadProfileImage } from "../store/ppobSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.ppob.profile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const firstName = form?.first_name ?? profile.first_name ?? "";
  const lastName = form?.last_name ?? profile.last_name ?? "";

  const onPickImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024) return alert("Ukuran maksimum gambar adalah 100kb.");

    try {
      await dispatch(uploadProfileImage(file)).unwrap();
      alert("Foto profile berhasil diperbarui.");
      dispatch(fetchProfile());
    } catch (err) {
      alert(err || "Gagal upload gambar.");
    }
  };

  const onSave = async () => {
    if (!firstName.trim() || !lastName.trim()) return alert("Nama wajib diisi.");

    try {
      await dispatch(updateProfile({ first_name: firstName.trim(), last_name: lastName.trim() })).unwrap();
      alert("Profile berhasil diperbarui.");
      setEditing(false);
      setForm(null);
    } catch (err) {
      alert(err || "Gagal memperbarui profile.");
    }
  };

  const onLogout = () => {
    dispatch(clearAuth());
    navigate("/login");
  };

  return (
    <section className="container page profile-page">
      <label className="image-picker">
        <ProfileImage src={profile.profile_image} className="profile-image" />
        <span className="edit-badge">E</span>
        <input type="file" accept="image/png,image/jpeg" onChange={onPickImage} />
      </label>
      <h2 className="profile-fullname">
        {profile.first_name} {profile.last_name}
      </h2>
      <div className="profile-form">
        <label>
          Email
          <input value={profile.email || ""} readOnly />
        </label>
        <label>
          Nama Depan
          <input
            value={firstName}
            onChange={(event) =>
              setForm((prev) => ({
                first_name: event.target.value,
                last_name: prev?.last_name ?? profile.last_name ?? "",
              }))
            }
            readOnly={!editing}
          />
        </label>
        <label>
          Nama Belakang
          <input
            value={lastName}
            onChange={(event) =>
              setForm((prev) => ({
                first_name: prev?.first_name ?? profile.first_name ?? "",
                last_name: event.target.value,
              }))
            }
            readOnly={!editing}
          />
        </label>
        {!editing ? (
          <>
            <button
              className="ghost-btn"
              onClick={() => {
                setForm({ first_name: profile.first_name || "", last_name: profile.last_name || "" });
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
            <button className="danger-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="action-row">
            <button className="danger-btn" onClick={onSave}>
              Simpan
            </button>
            <button
              className="ghost-btn"
              onClick={() => {
                setEditing(false);
                setForm(null);
              }}
            >
              Batalkan
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
