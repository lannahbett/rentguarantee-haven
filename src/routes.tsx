
import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import ListProperty from "./pages/ListProperty";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminSettings from "./pages/AdminSettings";
import TermsOfUse from "./pages/TermsOfUse";
import MarketingFlyer from "./pages/MarketingFlyer";
import RentPrediction from "./pages/RentPrediction";
import ForTenants from "./pages/ForTenants";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/list-property",
    element: <ListProperty />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/refund-policy",
    element: <RefundPolicy />,
  },
  {
    path: "/contact-us",
    element: <Contact />,
  },
  {
    path: "/terms-of-use",
    element: <TermsOfUse />,
  },
  {
    path: "/admin-settings",
    element: <AdminSettings />,
  },
  {
    path: "/marketing-flyer",
    element: <MarketingFlyer />,
  },
  {
    path: "/rent-predictor",
    element: <RentPrediction />,
  },
  {
    path: "/tenants",
    element: <ForTenants />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
