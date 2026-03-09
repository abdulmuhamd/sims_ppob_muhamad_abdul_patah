import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../store/authSlice";
import { ASSET } from "../constants/assets";

export default function AuthPage({ mode = "login" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token } = useSelector((state) => state.auth);
  const isRegister = mode === "register";
  const title = isRegister ? "Lengkapi data untuk membuat akun" : "Masuk atau buat akun untuk memulai";
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email.includes("@")) return setError("Format email tidak valid.");
    if (form.password.length < 8) return setError("Password minimal 8 karakter.");
    if (isRegister && form.password !== form.confirmPassword) return setError("Konfirmasi password tidak sama.");
    if (isRegister && (!form.first_name.trim() || !form.last_name.trim())) return setError("Nama depan dan belakang wajib diisi.");

    try {
      if (isRegister) {
        await dispatch(
          register({
            email: form.email.trim(),
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            password: form.password,
          }),
        ).unwrap();
        alert("Registrasi berhasil, silakan login.");
        navigate("/login");
        return;
      }

      await dispatch(login({ email: form.email.trim(), password: form.password })).unwrap();
      navigate("/");
    } catch (err) {
      setError(err || "Terjadi kesalahan.");
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-brand">
          <img src={`${ASSET}/Logo.png`} alt="Logo" className="auth-logo" />
          <span>SIMS PPOB</span>
        </div>
        <h1>{title}</h1>
        <form onSubmit={onSubmit}>
          <input
            placeholder="Masukkan email anda"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          {isRegister ? (
            <>
              <input
                placeholder="Nama depan"
                value={form.first_name}
                onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
              />
              <input
                placeholder="Nama belakang"
                value={form.last_name}
                onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
              />
            </>
          ) : null}
          <input
            placeholder={isRegister ? "buat password" : "masukkan password anda"}
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          {isRegister ? (
            <input
              placeholder="Konfirmasi password"
              type="password"
              value={form.confirmPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            />
          ) : null}
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : isRegister ? "Registrasi" : "Masuk"}
          </button>
        </form>
        {isRegister ? (
          <p className="inline-link">
            sudah punya akun? login <NavLink to="/login">di sini</NavLink>
          </p>
        ) : (
          <p className="inline-link">
            belum punya akun? registrasi <NavLink to="/register">di sini</NavLink>
          </p>
        )}
      </section>
      <section className="auth-hero">
        <img src={`${ASSET}/Illustrasi Login.png`} alt="Login Illustration" />
      </section>
    </main>
  );
}
