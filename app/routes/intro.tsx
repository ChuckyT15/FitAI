import type { Route } from "./+types/intro";
import { Link } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FitAI - Your AI-Powered Fitness Companion" },
    { name: "description", content: "Your AI-powered fitness companion for a healthier lifestyle" },
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

export default function Intro() {
  const scrollToForm = () => {
    const formElement = document.getElementById('form-section');
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <style>{`
        @keyframes swirl1 {
          0% { stroke-dashoffset: 1000; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }
        @keyframes swirl2 {
          0% { stroke-dashoffset: 800; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -800; }
        }
        @keyframes swirl3 {
          0% { stroke-dashoffset: 600; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -600; }
        }
        @keyframes swirl4 {
          0% { stroke-dashoffset: 700; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -700; }
        }
        @keyframes swirl5 {
          0% { stroke-dashoffset: 500; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -500; }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Abstract Green Line Swirl Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="greenGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="greenGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="greenGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Swirl 1 - Large flowing curve */}
          <path
            d="M-100,200 Q200,100 500,300 T900,200 Q1100,150 1300,250"
            stroke="url(#greenGradient1)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
            style={{
              animation: 'swirl1 8s ease-in-out infinite',
              strokeDasharray: '1000',
              strokeDashoffset: '1000'
            }}
          />
          
          {/* Swirl 2 - Medium curve */}
          <path
            d="M-50,400 Q300,300 600,500 T1000,400 Q1200,350 1400,450"
            stroke="url(#greenGradient2)"
            strokeWidth="2.5"
            fill="none"
            className="animate-pulse"
            style={{
              animation: 'swirl2 10s ease-in-out infinite',
              strokeDasharray: '800',
              strokeDashoffset: '800'
            }}
          />
          
          {/* Swirl 3 - Small delicate curve */}
          <path
            d="M0,600 Q250,500 550,700 T950,600 Q1150,550 1350,650"
            stroke="url(#greenGradient3)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{
              animation: 'swirl3 12s ease-in-out infinite',
              strokeDasharray: '600',
              strokeDashoffset: '600'
            }}
          />
          
          {/* Swirl 4 - Vertical flowing line */}
          <path
            d="M800,0 Q700,200 800,400 T800,800"
            stroke="url(#greenGradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{
              animation: 'swirl4 9s ease-in-out infinite',
              strokeDasharray: '700',
              strokeDashoffset: '700'
            }}
          />
          
          {/* Swirl 5 - Diagonal flowing line */}
          <path
            d="M200,0 Q400,200 200,400 T200,800"
            stroke="url(#greenGradient2)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{
              animation: 'swirl5 11s ease-in-out infinite',
              strokeDasharray: '500',
              strokeDashoffset: '500'
            }}
          />
          
          {/* Floating organic shapes */}
          <circle cx="150" cy="150" r="40" fill="url(#greenGradient1)" opacity="0.1">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 20,-10; 0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="1000" cy="300" r="60" fill="url(#greenGradient2)" opacity="0.08">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -15,20; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="300" cy="600" r="30" fill="url(#greenGradient3)" opacity="0.12">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 25,15; 0,0"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <h1 className="text-8xl md:text-5xl font-bold text-black mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
            FitAI
          </h1>
          <button
            onClick={scrollToForm}
            className="bg-gray-800/20 backdrop-blur-sm text-black px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-800/30 transition-all duration-300 border border-gray-600/30 hover:border-gray-600/50 inline-block"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div id="form-section" className="min-h-screen flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-lg border border-white/20">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Tell Us About Yourself
            </h1>
            <p className="text-gray-500 text-sm">
              Help us create your perfect workout plan
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                  placeholder="170"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                  placeholder="70"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Gender
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Fitness Level */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Fitness Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm">
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Primary Goal
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm">
                <option value="">Select Goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
                <option value="general-fitness">General Fitness</option>
              </select>
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors text-center"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Back to Top
              </button>
              <Link
                to="/camera"
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-900 transition-all duration-300 text-center hover:scale-105"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Next Page
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
