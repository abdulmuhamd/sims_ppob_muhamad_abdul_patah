import { useState } from "react";
import { useSelector } from "react-redux";
import { formatCurrency } from "../utils/format";

export default function BalanceCard() {
  const { balance, balanceVisible } = useSelector((state) => state.ppob);
  const [showBalance, setShowBalance] = useState(balanceVisible);

  return (
    <article className="balance-card">
      <p>Saldo anda</p>
      <h2>{showBalance ? formatCurrency(balance) : "Rp ******"}</h2>
      <button type="button" className="balance-toggle" onClick={() => setShowBalance((prev) => !prev)}>
        {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
        <svg className="balance-eye-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12C4.2 8.4 7.7 6.5 12 6.5S19.8 8.4 22 12c-2.2 3.6-5.7 5.5-10 5.5S4.2 15.6 2 12Z" />
          <circle cx="12" cy="12" r="2.2" />
        </svg>
      </button>
    </article>
  );
}
