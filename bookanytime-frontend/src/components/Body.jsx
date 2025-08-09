import React from "react";
import Categories from "./categories/CategoriesList";
import RecentlyViewed from "./recently_viewed/RecentlyViewed";
import Offers from "./offers_section/newOffers";
import Maps from "./map/map";
import Footer from "../Footer"; 
import Background from "../assets/background.png";
import Advertisement from "./advertisement/Advertisement";

function Body() {
  return (
    <div
      className="body-container"
      style={{
        paddingTop: "200px",
        marginTop: "20px",
        width: "100vw",
        // backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Categories />
      <RecentlyViewed />
      <Offers />
      <Advertisement />
      <Maps />
      <Footer />
    </div>
  );
}


export default Body;