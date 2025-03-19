import react from "react";

export default function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Authenticating...</span>
      </div>
    );
  }