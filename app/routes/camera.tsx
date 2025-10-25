import type { Route } from "./+types/camera";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FitAI - Camera" },
    { name: "description", content: "Take a photo for your workout plan" },
  ];
}

export function links() {
  return [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect", 
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    },
  ];
}

export default function Camera() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4 relative animate-in fade-in slide-in-from-right duration-700">
      {/* Back Button - Upper Left */}
      <Link
        to="/"
        className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-sm hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 z-10"
        style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}
      >
        ← Back
      </Link>

      {/* Camera Box - Made Bigger */}
      <div className="w-full max-w-4xl h-[600px] bg-black rounded-2xl shadow-2xl mb-8 flex items-center justify-center relative overflow-hidden">
        {/* Camera Icon */}
        <div className="text-center text-white">
          <div className="text-8xl mb-4">📷</div>
          <p className="text-lg opacity-80">Camera</p>
        </div>
        
        {/* Overlay elements */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div></div>
          <div></div>
        </div>
        
      </div>

      {/* Next Button */}
      <Link
        to="/home"
        className="bg-gray-800/20 backdrop-blur-sm px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-800/30 transition-all duration-300 border border-gray-600/30 hover:border-gray-600/50 inline-block animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
        style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}
      >
        Analyze Photo
      </Link>
    </div>
  );
}
