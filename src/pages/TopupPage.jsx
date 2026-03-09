import { useState } from "react";
import { useDispatch } from "react-redux";
import BalanceCard from "../components/BalanceCard";
import ProfileSummary from "../components/ProfileSummary";
import { fetchBalance, topup } from "../store/ppobSlice";

export default function TopupPage() {
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
    <section className="container page topup-page">
      <div className="hero-row">
        <ProfileSummary />
        <BalanceCard />
      </div>
      <div className="content-block">
        <p>Silahkan masukan</p>
        <h3>Nominal Top Up</h3>
        <div className="topup-area">
          <div className="topup-input-stack">
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))}
              placeholder="masukan nominal Top Up"
            />
            <button className="danger-btn topup-submit" disabled={!isValid} onClick={onTopup}>
              Top Up
            </button>
          </div>
          <div className="nominal-grid">
            {nominalOptions.map((nominal) => (
              <button key={nominal} onClick={() => setAmount(String(nominal))}>
                Rp{nominal.toLocaleString("id-ID")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
