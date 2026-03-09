import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, login, register } from "./store/authSlice";
import {
  fetchBanners,
  fetchBalance,
  fetchHistory,
  fetchProfile,
  fetchServices,
  topup,
  transaction,
  updateProfile,
  uploadProfileImage,
} from "./store/ppobSlice";
import { formatCurrency, formatDate } from "./utils/format";

const ASSET = "/assets";
const DEFAULT_PROFILE = `${ASSET}/Profile Photo.png`;
const LOCAL_BANNERS = [
  `${ASSET}/Banner 1.png`,
  `${ASSET}/Banner 2.png`,
  `${ASSET}/Banner 3.png`,
  `${ASSET}/Banner 4.png`,
  `${ASSET}/Banner 5.png`,
];
const SERVICE_ICON_MAP = {
  PULSA: `${ASSET}/Pulsa.png`,
  PLN: `${ASSET}/Listrik.png`,
  PLN_PRABAYAR: `${ASSET}/Listrik.png`,
  PLN_PASCABAYAR: `${ASSET}/Listrik.png`,
  PDAM: `${ASSET}/PDAM.png`,
  PGN: `${ASSET}/PGN.png`,
  TV: `${ASSET}/Televisi.png`,
  MUSIK: `${ASSET}/Musik.png`,
  VOUCHER_GAME: `${ASSET}/Game.png`,
  VOUCHER_MAKANAN: `${ASSET}/Voucher Makanan.png`,
  PAKET_DATA: `${ASSET}/Paket Data.png`,
  QURBAN: `${ASSET}/Kurban.png`,
  ZAKAT: `${ASSET}/Zakat.png`,
  PBB: `${ASSET}/PBB.png`,
};

function resolveProfileImage(url) {
  if (!url) return DEFAULT_PROFILE;
  const raw = String(url).trim().toLowerCase();
  if (!raw || raw.includes("null")) return DEFAULT_PROFILE;
  return url;
}

function resolveServiceIcon(service) {
  return SERVICE_ICON_MAP[service.service_code] || service.service_icon;
}

function resolveBannerImage(index, fallback) {
  return LOCAL_BANNERS[index] || fallback;
}

function ProfileImage({ src, className, alt = "Profile" }) {
  const [failed, setFailed] = useState(false);
  const finalSrc = failed ? DEFAULT_PROFILE : resolveProfileImage(src);
  return <img src={finalSrc} alt={alt} className={className} onError={() => setFailed(true)} />;
}

function AuthLayout({ mode = "login" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token } = useSelector((state) => state.auth);
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

  const isRegister = mode === "register";

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
        <img src={`${ASSET}/Logo.png`} alt="Logo" className="auth-logo" />
        <h1>Masuk atau buat akun untuk memulai</h1>
        <form onSubmit={onSubmit}>
          <input
            placeholder="Masukkan email anda"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          {isRegister && (
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
          )}
          <input
            placeholder="Buat password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          {isRegister && (
            <input
              placeholder="Konfirmasi password"
              type="password"
              value={form.confirmPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            />
          )}
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
            belum punya akun? register <NavLink to="/register">di sini</NavLink>
          </p>
        )}
      </section>
      <section className="auth-hero">
        <img src={`${ASSET}/Illustrasi Login.png`} alt="Login Illustration" />
      </section>
    </main>
  );
}

function Navbar() {
  return (
    <header className="top-nav">
      <div className="container nav-body">
        <div className="brand">
          <img src={`${ASSET}/Logo.png`} alt="Logo" />
          <span>SIMS PPOB</span>
        </div>
        <nav>
          <NavLink to="/topup">
            Top Up
          </NavLink>
          <NavLink to="/transaction">Transaction</NavLink>
          <NavLink to="/profile">Akun</NavLink>
        </nav>
      </div>
    </header>
  );
}

function BalanceCard() {
  const { balance, balanceVisible } = useSelector((state) => state.ppob);
  return (
    <article className="balance-card">
      <p>Saldo anda</p>
      <h2>{balanceVisible ? formatCurrency(balance) : "Rp ******"}</h2>
    </article>
  );
}

function ProfileSummary() {
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

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, banners } = useSelector((state) => state.ppob);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchBanners());
  }, [dispatch]);

  return (
    <section className="container page">
      <div className="hero-row">
        <ProfileSummary />
        <BalanceCard />
      </div>
      <div className="content-block">
        <h3>Pilih Layanan</h3>
        <div className="services-grid">
          {services.map((service) => (
            <button key={service.service_code} className="service-card" onClick={() => navigate(`/payment/${service.service_code}`)}>
              <img src={resolveServiceIcon(service)} alt={service.service_name} />
              <span>{service.service_name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="content-block">
        <h3>Temukan promo menarik</h3>
        <div className="banner-row">
          {banners.map((banner, index) => (
            <img
              key={banner.banner_name || index}
              src={resolveBannerImage(index, banner.banner_image)}
              alt={banner.banner_name || `Banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TopupPage() {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");

  const nominalOptions = [10000, 20000, 50000, 100000, 250000, 500000];
  const parsedAmount = Number(amount);
  const isValid = parsedAmount >= 10000 && parsedAmount <= 1000000;

  const onTopup = async () => {
    try {
      await dispatch(topup(parsedAmount)).unwrap();
      alert("Top up berhasil.");
      setAmount("");
      dispatch(fetchBalance());
    } catch (err) {
      alert(err || "Top up gagal.");
    }
  };

  return (
    <section className="container page">
      <div className="hero-row">
        <ProfileSummary />
        <BalanceCard />
      </div>
      <div className="content-block">
        <h3>Silahkan masukkan nominal Top Up</h3>
        <div className="topup-area">
          <input value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} placeholder="masukkan nominal Top Up" />
          <div className="nominal-grid">
            {nominalOptions.map((nominal) => (
              <button key={nominal} onClick={() => setAmount(String(nominal))}>
                Rp{nominal.toLocaleString("id-ID")}
              </button>
            ))}
          </div>
        </div>
        <button className="danger-btn" disabled={!isValid} onClick={onTopup}>
          Top Up
        </button>
      </div>
    </section>
  );
}

function PaymentPage() {
  const dispatch = useDispatch();
  const { serviceCode } = useParams();
  const { services } = useSelector((state) => state.ppob);
  const selectedService = useMemo(() => services.find((item) => item.service_code === serviceCode), [services, serviceCode]);

  useEffect(() => {
    if (!services.length) dispatch(fetchServices());
  }, [dispatch, services.length]);

  if (!selectedService) {
    return (
      <section className="container page">
        <p>Layanan tidak ditemukan.</p>
      </section>
    );
  }

  const onPay = async () => {
    try {
      await dispatch(transaction(selectedService.service_code)).unwrap();
      alert("Pembayaran berhasil.");
      dispatch(fetchBalance());
    } catch (err) {
      alert(err || "Pembayaran gagal.");
    }
  };

  return (
    <section className="container page">
      <div className="hero-row">
        <ProfileSummary />
        <BalanceCard />
      </div>
      <div className="content-block">
        <h3>Pembayaran</h3>
        <div className="payment-info">
          <img src={resolveServiceIcon(selectedService)} alt={selectedService.service_name} />
          <span>{selectedService.service_name}</span>
        </div>
        <input value={formatCurrency(selectedService.service_tariff)} readOnly />
        <button className="danger-btn" onClick={onPay}>
          Bayar
        </button>
      </div>
    </section>
  );
}

function TransactionPage() {
  const dispatch = useDispatch();
  const { history, historyOffset } = useSelector((state) => state.ppob);

  useEffect(() => {
    dispatch(fetchHistory({ offset: 0, limit: 5, append: false }));
  }, [dispatch]);

  const onShowMore = () => {
    dispatch(fetchHistory({ offset: historyOffset + 5, limit: 5, append: true }));
  };

  return (
    <section className="container page">
      <div className="hero-row">
        <ProfileSummary />
        <BalanceCard />
      </div>
      <div className="content-block">
        <h3>Semua Transaksi</h3>
        <div className="history-list">
          {history.map((item) => (
            <article key={item.invoice_number} className="history-item">
              <div>
                <h4 className={item.transaction_type === "TOPUP" ? "plus" : "minus"}>
                  {item.transaction_type === "TOPUP" ? "+" : "-"}
                  {formatCurrency(item.total_amount)}
                </h4>
                <p>{formatDate(item.created_on)}</p>
              </div>
              <span>{item.description}</span>
            </article>
          ))}
        </div>
        <button className="link-btn" onClick={onShowMore}>
          Show more
        </button>
      </div>
    </section>
  );
}

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.ppob.profile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "" });

  useEffect(() => {
    setForm({ first_name: profile.first_name || "", last_name: profile.last_name || "" });
  }, [profile.first_name, profile.last_name]);

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
    if (!form.first_name.trim() || !form.last_name.trim()) return alert("Nama wajib diisi.");
    try {
      await dispatch(updateProfile(form)).unwrap();
      alert("Profile berhasil diperbarui.");
      setEditing(false);
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
        <span>Ubah Foto Profile</span>
        <input type="file" accept="image/png,image/jpeg" onChange={onPickImage} />
      </label>
      <div className="profile-form">
        <input value={profile.email || ""} readOnly />
        <input value={form.first_name} onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))} readOnly={!editing} />
        <input value={form.last_name} onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))} readOnly={!editing} />
        {!editing ? (
          <button className="danger-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="action-row">
            <button className="danger-btn" onClick={onSave}>
              Simpan
            </button>
            <button className="ghost-btn" onClick={() => setEditing(false)}>
              Batalkan
            </button>
          </div>
        )}
        <button className="ghost-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </section>
  );
}

function PrivateLayout() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch, token]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/topup" element={<TopupPage />} />
        <Route path="/payment/:serviceCode" element={<PaymentPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout mode="login" />} />
      <Route path="/register" element={<AuthLayout mode="register" />} />
      <Route path="/*" element={<PrivateLayout />} />
    </Routes>
  );
}
