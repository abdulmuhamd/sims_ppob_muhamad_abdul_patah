import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BalanceCard from "../components/BalanceCard";
import ProfileSummary from "../components/ProfileSummary";
import { fetchHistory } from "../store/ppobSlice";
import { formatCurrency, formatDate } from "../utils/format";

export default function TransactionPage() {
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
