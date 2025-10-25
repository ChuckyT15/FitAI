import type { Route } from "./+types/form";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FitAI - Personal Information" },
    { name: "description", content: "Tell us about yourself to create your personalized workout plan" },
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

export default function Form() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
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
            <Link
              to="/"
              className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors text-center"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Back
            </Link>
            <Link
              to="/camera"
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors text-center"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Next Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
