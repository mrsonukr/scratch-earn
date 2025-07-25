import React, { useRef, useEffect, useState } from "react";
import Confetti from "react-confetti";

const Scratch = ({ onScratchComplete }) => {
  const canvasRef = useRef(null);
  const brushRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [cleared, setCleared] = useState(false);
  const [reward, setReward] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasStartedScratching, setHasStartedScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const scratchImage = new Image();
    scratchImage.src = "/scratch-top.png";
    scratchImage.onload = () => {
      // Wait a bit to ensure background is rendered first
      setTimeout(() => {
        ctx.drawImage(scratchImage, 0, 0, canvas.width, canvas.height);
        setImageLoaded(true);
        setIsLoaded(true);
      }, 100);
    };

    const brush = new Image();
    brush.src = "/brush.png";
    brushRef.current = brush;
  }, []);

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    return { x, y };
  };

  const generateReward = () => {
    if (reward === null) {
      const newReward = Math.floor(Math.random() * (625 - 425 + 1)) + 425;
      setReward(newReward);
      return newReward;
    }
    return reward;
  };

  const drawBrush = (from, to) => {
    if (!imageLoaded) return; // Prevent scratching before image loads
    
    const ctx = canvasRef.current.getContext("2d");
    const dist = Math.hypot(from.x - to.x, from.y - to.y);
    const ang = Math.atan2(to.y - from.y, to.x - from.x);
    ctx.globalCompositeOperation = "destination-out";

    for (let i = 0; i < dist; i++) {
      const x = from.x + Math.cos(ang) * i - 25;
      const y = from.y + Math.sin(ang) * i - 25;
      ctx.drawImage(brushRef.current, x, y, 50, 50);
    }

    checkScratchCompletion();
  };

  const checkScratchCompletion = () => {
    if (cleared) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparentPixels++;
    }

    const scratchedPercent =
      (transparentPixels / (canvas.width * canvas.height)) * 100;

    if (scratchedPercent > 30) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCleared(true);
      onScratchComplete(reward); // Send reward
    }
  };

  function handleStart(e) {
    if (!imageLoaded) return; // Prevent interaction before loaded
    
    // Prevent iOS pull-to-refresh and scrolling
    e.preventDefault();
    
    if (!hasStartedScratching) {
      generateReward();
      setHasStartedScratching(true);
    }
    isDrawing.current = true;
    lastPoint.current = getPoint(e);
  }

  function handleMove(e) {
    if (!isDrawing.current || !imageLoaded) return;
    
    // Prevent iOS pull-to-refresh and scrolling
    e.preventDefault();
    
    const currentPoint = getPoint(e);
    drawBrush(lastPoint.current, currentPoint);
    lastPoint.current = currentPoint;
  }

  function handleEnd() {
    isDrawing.current = false;
  }

  return (
    <div className="flex items-center justify-center m-6 relative">
      <div className="relative w-[300px] h-[300px] overflow-hidden">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
        
        {/* Background content - only show when loaded */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isLoaded && hasStartedScratching ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/scratch-bg.png" alt="bg" className="w-full" />
          {reward && (
            <h2 className="text-blue-700 font-extrabold text-center text-5xl py-3">
              ₹ {reward}
            </h2>
          )}
        </div>

        {/* Canvas overlay - only interactive when loaded */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          style={{ pointerEvents: imageLoaded ? 'auto' : 'none' }}
        />

        {/* Confetti effect */}
        {cleared && (
          <div className="absolute inset-0 pointer-events-none z-30">
            <Confetti width={300} height={500} numberOfPieces={15} gravity={0.3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Scratch;
