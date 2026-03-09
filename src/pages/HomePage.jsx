import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../components/BalanceCard";
import ProfileSummary from "../components/ProfileSummary";
import { fetchBanners, fetchServices } from "../store/ppobSlice";
import { resolveBannerImage, resolveServiceIcon } from "../utils/assetResolvers";

export default function HomePage() {
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
