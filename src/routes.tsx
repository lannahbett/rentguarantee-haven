
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
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import HowItWorksRoompeer from "./pages/HowItWorksRoompeer";
import SafetyTrust from "./pages/SafetyTrust";
import BrowseMatch from "./pages/BrowseMatch";
import DiscoverySettings from "./pages/DiscoverySettings";
import Matches from "./pages/Matches";
import CookiePolicy from "./pages/CookiePolicy";
import RoompeerPrivacyPolicy from "./pages/RoompeerPrivacyPolicy";
import RoompeerPricing from "./pages/RoompeerPricing";
import RoompeerBilling from "./pages/RoompeerBilling";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";

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
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "/profile/:id",
    element: <UserProfile />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorksRoompeer />,
  },
  {
    path: "/safety",
    element: <SafetyTrust />,
  },
  {
    path: "/browse",
    element: <BrowseMatch />,
  },
  {
    path: "/discovery-settings",
    element: <DiscoverySettings />,
  },
  {
    path: "/matches",
    element: <Matches />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicy />,
  },
  {
    path: "/roompeer-privacy-policy",
    element: <RoompeerPrivacyPolicy />,
  },
  {
    path: "/how-it-works-roompeer",
    element: <HowItWorksRoompeer />,
  },
  {
    path: "/safety-trust",
    element: <SafetyTrust />,
  },
  {
    path: "/roompeer-pricing",
    element: <RoompeerPricing />,
  },
  {
    path: "/roompeer-billing",
    element: <RoompeerBilling />,
  },
  {
    path: "/browse-match",
    element: <BrowseMatch />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
