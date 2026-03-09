import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BalanceCard from "../components/BalanceCard";
import ProfileSummary from "../components/ProfileSummary";
import { fetchBalance, fetchServices, transaction } from "../store/ppobSlice";
import { resolveServiceIcon } from "../utils/assetResolvers";
import { formatCurrency } from "../utils/format";

export default function PaymentPage() {
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
        <button className="danger-btn payment-submit" onClick={onPay}>
          Bayar
        </button>
      </div>
    </section>
  );
}
