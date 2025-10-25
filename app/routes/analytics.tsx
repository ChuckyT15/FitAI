import type { Route } from "./+types/analytics";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FitAI - Your Analytics" },
    { name: "description", content: "Your personalized body composition and fitness analytics" },
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

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light style={{ color: '#000000' }} mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Analytics
          </h1>
          <div className="w-16 h-0.5 bg-gray-300"></div>
        </div>

        {/* Section 1: Body Composition Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold style={{ color: '#000000' }} mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Body Composition Analysis
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* BMI Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold style={{ color: '#000000' }} text-sm">BMI</h3>
                <div className="text-blue-600">📊</div>
              </div>
              <div className="text-2xl font-bold style={{ color: '#000000' }} mb-1">22.4</div>
              <div className="text-xs style={{ color: '#000000' }}">Healthy Range</div>
            </div>

            {/* Body Fat % Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold style={{ color: '#000000' }} text-sm">Body Fat %</h3>
                <div className="text-green-600">💪</div>
              </div>
              <div className="text-2xl font-bold style={{ color: '#000000' }} mb-1">15.2%</div>
              <div className="text-xs style={{ color: '#000000' }}">Good</div>
            </div>

            {/* Muscle Mass Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold style={{ color: '#000000' }} text-sm">Muscle Mass</h3>
                <div className="text-purple-600">🏋️</div>
              </div>
              <div className="text-2xl font-bold style={{ color: '#000000' }} mb-1">68.5kg</div>
              <div className="text-xs style={{ color: '#000000' }}">Above Average</div>
            </div>

            {/* Fitness Score Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold style={{ color: '#000000' }} text-sm">Fitness Score</h3>
                <div className="text-orange-600">⭐</div>
              </div>
              <div className="text-2xl font-bold style={{ color: '#000000' }} mb-1">8.2/10</div>
              <div className="text-xs style={{ color: '#000000' }}">Excellent</div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold style={{ color: '#000000' }} mb-3 text-sm">AI Analysis Summary</h3>
            <p className="text-sm style={{ color: '#000000' }} leading-relaxed mb-4">
              Based on your body composition analysis, you have a healthy BMI and good muscle mass distribution. 
              Your body fat percentage indicates a well-balanced physique with room for improvement in specific areas.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium style={{ color: '#000000' }} mb-2 text-sm">Strengths</h4>
                <ul className="text-xs style={{ color: '#000000' }} space-y-1">
                  <li>• Healthy BMI range</li>
                  <li>• Good muscle mass</li>
                  <li>• Balanced body composition</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium style={{ color: '#000000' }} mb-2 text-sm">Areas for Improvement</h4>
                <ul className="text-xs style={{ color: '#000000' }} space-y-1">
                  <li>• Core stability training</li>
                  <li>• Flexibility enhancement</li>
                  <li>• Cardiovascular endurance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Detailed Metrics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold style={{ color: '#000000' }} mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Detailed Metrics
          </h2>
          
          {/* Areas to Improve */}
          <div className="mb-6">
            <h3 className="font-semibold style={{ color: '#000000' }} mb-4 text-sm">Fitness Areas Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="style={{ color: '#000000' }} text-sm">Upper Body Strength</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                  </div>
                  <span className="style={{ color: '#000000' }} text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="style={{ color: '#000000' }} text-sm">Core Stability</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
                  </div>
                  <span className="style={{ color: '#000000' }} text-sm font-medium">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="style={{ color: '#000000' }} text-sm">Flexibility</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                  </div>
                  <span className="style={{ color: '#000000' }} text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="style={{ color: '#000000' }} text-sm">Cardiovascular Endurance</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full transition-all duration-1000" style={{ width: '35%' }}></div>
                  </div>
                  <span className="style={{ color: '#000000' }} text-sm font-medium">35%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold style={{ color: '#000000' }} mb-3 text-sm">AI Recommendations</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="text-blue-500 mt-0.5">💡</div>
                <p className="text-sm style={{ color: '#000000' }}">Focus on core strengthening exercises to improve stability</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">💡</div>
                <p className="text-sm style={{ color: '#000000' }}">Incorporate daily stretching routines for better flexibility</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-orange-500 mt-0.5">💡</div>
                <p className="text-sm style={{ color: '#000000' }}">Add 2-3 cardio sessions per week to boost endurance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Next Steps */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold style={{ color: '#000000' }} mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready for Your Personalized Plan?
          </h2>
          
          <div className="text-center">
            <p className="style={{ color: '#000000' }} mb-6 leading-relaxed">
              Based on your analytics, we've prepared a customized workout and nutrition plan 
              designed specifically for your body composition and fitness goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/home"
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                View Workout & Diet Plan
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="bg-gray-200 style={{ color: '#000000' }} px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Back to Camera
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
