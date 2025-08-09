import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";  // Main Header
import Body from "./components/Body";  
import Search from "./components/Header/SearchBar"; 
import AdminPanel from "./components/admin_panel/AdminPanel"; 
import Properties from "./components/admin_panel/properties/Properties";
import AddProperty from "./components/admin_panel/properties/AddProperties";
import UpdatePropertyPage from "./components/admin_panel/properties/UpdatePropertyPage"; 
import Offers from "./components/admin_panel/offers/OffersPage";
import TrackedData from "./components/admin_panel/tracked_data/TrackedData"
import CategoryPage from "./components/categories/CategoryPage";
import PropertyDetails from "./components/categories/PropertyDetails";
import AuthPage from "./components/AuthPage";
import WishlistPage from "./components/WishList/WishlistPage";
import WishlistDetailsPage from "./components/WishList/WishListDetailsPage";
import ListYourProperty from "./components/list_your_property/ListYourProperty"
import ListPropertyLogs from "./components/admin_panel/list-your-property/ListPropertyLogs"
import OffersDetailsPage from "./components/offers_section/OffersDetailsPage"
import FeedbackComponent from "./components/feedback/FeedbackComponent";
import FeedbackAdmin from "./components/admin_panel/feedback/FeedbackAdmin";
import HelpCenter from "./components/help_center/HelpCenter"
// Protect admin routes


const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.isAdmin === true;

  if (!token || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // Check if on Admin pages

  return (
    <>

<style>
        {`
          * {
            font-family: 'Times New Roman', Times, serif ;
                        text-transform: capitalize ;

          }
        `}
      </style>
      {!isAdminRoute && <Header />}  {/* Hide main header on admin pages */}

      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/:categoryName" element={<CategoryPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<AuthPage key="login" isSignup={false} />} />
        <Route path="/signup" element={<AuthPage key="signup" isSignup={true} />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/wishlist/:wishlistId" element={<WishlistDetailsPage />} />
        <Route path="/list-your-property" element={<ListYourProperty/>} />
        <Route path="/offers/:offerId" element={<OffersDetailsPage />} /> 
        <Route path="/feedback" element={<FeedbackComponent/>} />
        <Route path="/help-center" element={<HelpCenter/>} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>}>
          <Route path="properties" element={<AdminRoute><Properties /></AdminRoute>} />
          <Route path="add-property" element={<AdminRoute><AddProperty /></AdminRoute>} />
          <Route path="update-property/:id" element={<AdminRoute><UpdatePropertyPage /></AdminRoute>} />
          <Route path="offers" element={<AdminRoute><Offers /></AdminRoute>} />
          <Route path="trackData" element={<AdminRoute><TrackedData /></AdminRoute>} />
          <Route path="list-property-logs" element={<AdminRoute><ListPropertyLogs /></AdminRoute>} />
          <Route path="feedback-logs" element={<AdminRoute><FeedbackAdmin /></AdminRoute>} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
