import React, { useState, useEffect, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";

const Spinner = ({
  isOpen,
  onClose,
  message = "Loading...",
  spinnerSize = "lg",
  spinnerColor = "#4F46E5",
  animationSpeed = "fast",
  position = "center"
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const getSizeClasses = () => {
    switch (spinnerSize) {
      case "sm":
        return "w-8 h-8";
      case "lg":
        return "w-16 h-16";
      case "xl":
        return "w-24 h-24";
      default:
        return "w-12 h-12";
    }
  };

  const getSpeedClasses = () => {
    switch (animationSpeed) {
      case "slow":
        return "animate-spin-slow";
      case "fast":
        return "animate-spin-fast";
      default:
        return "animate-spin";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "items-start pt-20";
      case "bottom":
        return "items-end pb-20";
      default:
        return "items-center";
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center transition-opacity duration-300 bg-gray-700 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`flex min-h-screen w-full flex-col justify-center ${getPositionClasses()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center max-w-sm p-8 mx-auto bg-white shadow-2xl rounded-xl bg-opacity-90">
          <FaSpinner
            className={`${getSizeClasses()} ${getSpeedClasses()} text-indigo-600`}
            style={{ color: spinnerColor }}
            role="progressbar"
            aria-valuetext={message}
            size={20}
          />
          <p
            className="mt-4 text-lg font-medium text-center text-gray-700"
            id="modal-title"
          >
            {message}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-fast {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-fast 0.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Spinner;