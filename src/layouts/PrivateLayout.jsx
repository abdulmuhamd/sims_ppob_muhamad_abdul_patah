import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomePage from "../pages/HomePage";
import PaymentPage from "../pages/PaymentPage";
import ProfilePage from "../pages/ProfilePage";
import TopupPage from "../pages/TopupPage";
import TransactionPage from "../pages/TransactionPage";
import { fetchBalance, fetchProfile } from "../store/ppobSlice";

export default function PrivateLayout() {
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
