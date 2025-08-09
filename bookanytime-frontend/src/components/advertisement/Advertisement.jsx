import React from "react";
import Banner from "../../assets/banner.png";

const Advertisement = ({ src = Banner, alt = "Banner", height = "400px" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center",     // vertical center (optional)
        padding: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "90%",
          height: height,
          overflow: "hidden",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px", // optional, looks nice
          }}
        />
      </div>
    </div>
  );
};

export default Advertisement;
