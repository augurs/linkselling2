import React, { useState, useEffect } from "react";
import { thankupage } from "../../../services/authServices/authservices";
import { HiPlay } from "react-icons/hi";

const Thankyou = () => {
  const [thankreg, setThankreg] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem("lang"));

  useEffect(() => {
    thankafterreg();
  }, []);

  const thankafterreg = async () => {
    const res = await thankupage();
    setThankreg(res?.data);
  };



  const playVideo = () => {
    const videoLink = thankreg[0]?.video_link;
    if (videoLink) {
      window.open(videoLink);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: "98vh" }}>
      {language === "pl" ? (
        <h2 dangerouslySetInnerHTML={{ __html: thankreg[0]?.polish_text }}></h2>
      ) : (
        <h2 dangerouslySetInnerHTML={{ __html: thankreg[0]?.text }}></h2>
      )}
      <span onClick={playVideo}>
        <HiPlay size={52} />
      </span>
    </div>
  );
};

export default Thankyou;
