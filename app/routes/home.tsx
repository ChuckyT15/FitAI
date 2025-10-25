import type { Route } from "./+types/home";
import React, { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FitAI - Your Workout Plan" },
    { name: "description", content: "Your personalized workout plan" },
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

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<string | null>("Mon");
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("analytics");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Loading effect
  React.useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + 2;
      });
    }, 80); // 4 seconds total (100 * 80ms = 8000ms, but we're incrementing by 2, so 50 * 80ms = 4000ms)

    return () => clearInterval(loadingInterval);
  }, []);

  // Scroll effect to update active section
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['analytics', 'workout', 'nutrition'];
      const scrollPosition = window.scrollY + 200; // Offset to account for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'analytics') {
      // For analytics, scroll to the very top of the page
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        // Get the element's position and adjust for better spacing
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const offset = -5; // Move slightly above the element position
        
        window.scrollTo({
          top: absoluteElementTop - offset,
          behavior: 'smooth'
        });
      }
    }
    setActiveSection(sectionId);
  };

  const weeklySchedule = [
    { day: "Mon", workout: "Push Day", location: "RPAC Floor 2", completed: false },
    { day: "Tue", workout: "Yoga Stretch", location: "Jesse Owens South", completed: false },
    { day: "Wed", workout: "Pull Day", location: "RPAC Floor 2", completed: false },
    { day: "Thu", workout: "Cardio", location: "North Rec Treadmills", completed: false },
    { day: "Fri", workout: "Leg Day", location: "RPAC Floor 1", completed: false },
    { day: "Sat", workout: "Recovery", location: "Home", completed: false },
    { day: "Sun", workout: "Rest", location: "", completed: false },
  ];

  const dayExercises = {
    "Mon": [
      {
        id: "bench-press",
        name: "Bench Press",
        sets: "4 sets",
        reps: "8-10 reps",
        tips: "Keep your core tight and maintain a slight arch in your back",
        equipment: "Bench press station, Floor 2"
      },
      {
        id: "incline-dumbbell-press",
        name: "Incline Dumbbell Press",
        sets: "3 sets",
        reps: "10-12 reps",
        tips: "Control the weight on the way down, explode up",
        equipment: "Adjustable bench, Floor 2"
      },
      {
        id: "tricep-dips",
        name: "Tricep Dips",
        sets: "3 sets",
        reps: "8-12 reps",
        tips: "Keep your body straight, don't let your shoulders roll forward",
        equipment: "Dip bars, Floor 2"
      }
    ],
    "Wed": [
      {
        id: "pull-ups",
        name: "Pull-ups",
        sets: "4 sets",
        reps: "6-10 reps",
        tips: "Start from a dead hang, pull your chest to the bar",
        equipment: "Pull-up bar, Floor 2"
      },
      {
        id: "bent-over-rows",
        name: "Bent-over Rows",
        sets: "4 sets",
        reps: "8-10 reps",
        tips: "Keep your back straight, pull the bar to your lower chest",
        equipment: "Barbell, Floor 2"
      },
      {
        id: "bicep-curls",
        name: "Bicep Curls",
        sets: "3 sets",
        reps: "12-15 reps",
        tips: "Control the weight, don't swing your body",
        equipment: "Dumbbells, Floor 2"
      }
    ],
    "Fri": [
      {
        id: "squats",
        name: "Squats",
        sets: "4 sets",
        reps: "8-10 reps",
        tips: "Keep your chest up, go below parallel",
        equipment: "Squat rack, Floor 1"
      },
      {
        id: "deadlifts",
        name: "Deadlifts",
        sets: "4 sets",
        reps: "5-8 reps",
        tips: "Keep your back straight, drive through your heels",
        equipment: "Barbell, Floor 1"
      },
      {
        id: "lunges",
        name: "Walking Lunges",
        sets: "3 sets",
        reps: "12 each leg",
        tips: "Keep your front knee over your ankle",
        equipment: "Open space, Floor 1"
      }
    ]
  };

  const getExercisesForDay = (day: string) => {
    return dayExercises[day as keyof typeof dayExercises] || [];
  };

  const getWorkoutDescription = (day: string) => {
    const descriptions = {
      "Mon": "Upper body push movements focusing on chest, shoulders, and triceps. Perfect for building upper body strength and muscle mass.",
      "Tue": "Gentle yoga and stretching session to improve flexibility, reduce muscle tension, and promote recovery.",
      "Wed": "Upper body pull movements targeting back, biceps, and rear delts. Great for building a strong, balanced upper body.",
      "Thu": "Cardiovascular training to improve heart health, endurance, and fat burning. Mix of steady-state and interval training.",
      "Fri": "Lower body strength training focusing on legs, glutes, and core. Essential for building power and athleticism.",
      "Sat": "Active recovery with light movement, stretching, and mobility work to help your body recover from the week's training.",
      "Sun": "Complete rest day. Your body needs time to recover and adapt to the training stimulus for optimal results."
    };
    return descriptions[day as keyof typeof descriptions] || "Select a workout day to see details.";
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center w-full max-w-md mx-auto px-4">
          <div className="text-6xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
            FitAI
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-lg" style={{ color: '#000000' }}>
            Analyzing your photo and generating your personalized plan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Vertical Navigation Bar */}
      <div className="w-64 bg-black backdrop-blur-sm border-r border-gray-700 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF' }}>
            FitAI
          </h1>
          <div className="w-12 h-0.5 bg-gray-400"></div>
        </div>

        <nav className="relative">
          <div className="space-y-12">
            <button
              onClick={() => scrollToSection('analytics')}
              className={`relative w-full text-left px-4 py-6 transition-all duration-200 ${
                activeSection === 'analytics'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center relative">
                {/* Line connecting to next bullet */}
                <div className="absolute left-1.5 top-6 w-0.5 h-24 bg-gray-600"></div>
                <div className={`w-3 h-3 rounded-full border-2 mr-4 transition-all duration-200 relative z-10 ${
                  activeSection === 'analytics'
                    ? 'bg-white border-white'
                    : 'border-gray-400 hover:border-white'
                }`}></div>
                <span className="font-medium text-lg">Analytics</span>
              </div>
            </button>
            
            <button
              onClick={() => scrollToSection('workout')}
              className={`relative w-full text-left px-4 py-6 transition-all duration-200 ${
                activeSection === 'workout'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center relative">
                {/* Line connecting to next bullet */}
                <div className="absolute left-1.5 top-6 w-0.5 h-24 bg-gray-600"></div>
                <div className={`w-3 h-3 rounded-full border-2 mr-4 transition-all duration-200 relative z-10 ${
                  activeSection === 'workout'
                    ? 'bg-white border-white'
                    : 'border-gray-400 hover:border-white'
                }`}></div>
                <span className="font-medium text-lg">Workout Plan</span>
              </div>
            </button>
            
            <button
              onClick={() => scrollToSection('nutrition')}
              className={`relative w-full text-left px-4 py-6 transition-all duration-200 ${
                activeSection === 'nutrition'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center relative">
                {/* No line for the last bullet */}
                <div className={`w-3 h-3 rounded-full border-2 mr-4 transition-all duration-200 relative z-10 ${
                  activeSection === 'nutrition'
                    ? 'bg-white border-white'
                    : 'border-gray-400 hover:border-white'
                }`}></div>
                <span className="font-medium text-lg">Nutrition Plan</span>
              </div>
            </button>
          </div>
        </nav>
        </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 pl-4 pr-16">

          {/* Analytics Section */}
          <section id="analytics" className="min-h-screen mb-16 pt-2">
            <div className="mb-8">
              <h2 className="text-4xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
            Analytics
          </h2>
              <div className="w-16 h-0.5 bg-gray-300"></div>
            </div>

            {/* Body Composition Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Body Composition Analysis
              </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* BMI Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>BMI</h4>
                <div className="text-blue-600">📊</div>
              </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>22.4</div>
                  <div className="text-xs" style={{ color: '#000000' }}>Healthy Range</div>
            </div>

            {/* Body Fat % Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Body Fat %</h4>
                <div className="text-green-600">💪</div>
              </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>15.2%</div>
                  <div className="text-xs" style={{ color: '#000000' }}>Good</div>
            </div>

            {/* Muscle Mass Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Muscle Mass</h4>
                <div className="text-purple-600">🏋️</div>
              </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>68.5kg</div>
                  <div className="text-xs" style={{ color: '#000000' }}>Above Average</div>
            </div>

            {/* Fitness Score Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Fitness Score</h4>
                <div className="text-orange-600">⭐</div>
              </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>8.2/10</div>
                  <div className="text-xs" style={{ color: '#000000' }}>Excellent</div>
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#000000' }}>Areas to Focus On</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#000000' }}>Upper Body Strength</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                      <span className="text-xs" style={{ color: '#000000' }}>75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#000000' }}>Core Stability</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                      <span className="text-xs" style={{ color: '#000000' }}>60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#000000' }}>Flexibility</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                      <span className="text-xs" style={{ color: '#000000' }}>45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#000000' }}>Cardiovascular Endurance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-xs" style={{ color: '#000000' }}>35%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Progress Tracking
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Weekly Progress */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>This Week's Progress</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#000000' }}>Workouts Completed</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>3/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#000000' }}>Calories Burned</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>1,650/2,200</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#000000' }}>Protein Intake</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>140/165g</span>
              </div>
            </div>
          </div>
        </div>

                {/* Monthly Trends */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Monthly Trends</h4>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>Weight Loss</span>
                        <span className="text-green-600 text-sm">↗ +2.1kg</span>
                      </div>
                      <p className="text-xs" style={{ color: '#000000' }}>Muscle gain this month</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>Strength Gains</span>
                        <span className="text-blue-600 text-sm">↗ +15%</span>
                      </div>
                      <p className="text-xs" style={{ color: '#000000' }}>Bench press improvement</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>Consistency</span>
                        <span className="text-orange-600 text-sm">↗ 92%</span>
              </div>
                      <p className="text-xs" style={{ color: '#000000' }}>Workout attendance rate</p>
            </div>
              </div>
            </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#000000' }}>Quick Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                    <div className="text-xs" style={{ color: '#000000' }}>Days Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">47</div>
                    <div className="text-xs" style={{ color: '#000000' }}>Total Workouts</div>
            </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">8.2</div>
                    <div className="text-xs" style={{ color: '#000000' }}>Avg Rating</div>
          </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">156</div>
                    <div className="text-xs" style={{ color: '#000000' }}>Hours Trained</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workout History Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Workout History
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Workouts */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Recent Workouts</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Push Day", date: "Today", duration: "45 min", calories: 320, rating: 4.5 },
                      { name: "Cardio", date: "Yesterday", duration: "30 min", calories: 280, rating: 4.0 },
                      { name: "Pull Day", date: "2 days ago", duration: "50 min", calories: 350, rating: 4.8 },
                      { name: "Leg Day", date: "3 days ago", duration: "55 min", calories: 420, rating: 4.2 },
                      { name: "Yoga", date: "4 days ago", duration: "25 min", calories: 150, rating: 4.6 }
                    ].map((workout, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm" style={{ color: '#000000' }}>{workout.name}</h5>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium" style={{ color: '#000000' }}>{workout.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{workout.date} • {workout.duration}</span>
                          <span>{workout.calories} cal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workout Intensity Chart */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Weekly Intensity</h4>
                  <div className="space-y-2">
                    {[
                      { day: "Mon", intensity: 85, type: "Push" },
                      { day: "Tue", intensity: 40, type: "Yoga" },
                      { day: "Wed", intensity: 90, type: "Pull" },
                      { day: "Thu", intensity: 70, type: "Cardio" },
                      { day: "Fri", intensity: 95, type: "Legs" },
                      { day: "Sat", intensity: 30, type: "Recovery" },
                      { day: "Sun", intensity: 0, type: "Rest" }
                    ].map((day, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 text-xs font-medium" style={{ color: '#000000' }}>{day.day}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${day.intensity}%` }}
                          ></div>
                        </div>
                        <div className="w-16 text-xs text-gray-600">{day.intensity}%</div>
                        <div className="w-12 text-xs text-gray-500">{day.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Tracking Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Goals Tracking
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Weight Goal */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Weight Goal</h4>
                    <div className="text-blue-600">⚖️</div>
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>75kg</div>
                  <div className="text-xs mb-3" style={{ color: '#000000' }}>Target: 80kg</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#000000' }}>94% Complete</div>
                </div>

                {/* Strength Goal */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Bench Press</h4>
                    <div className="text-green-600">💪</div>
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>85kg</div>
                  <div className="text-xs mb-3" style={{ color: '#000000' }}>Target: 100kg</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#000000' }}>85% Complete</div>
                </div>

                {/* Cardio Goal */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>5K Time</h4>
                    <div className="text-orange-600">🏃</div>
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>22:30</div>
                  <div className="text-xs mb-3" style={{ color: '#000000' }}>Target: 20:00</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#000000' }}>78% Complete</div>
                </div>
              </div>
            </div>

            {/* Body Measurements Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Body Measurements
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Chest", current: "98cm", change: "+2cm", trend: "up" },
                  { name: "Waist", current: "82cm", change: "-1cm", trend: "down" },
                  { name: "Arms", current: "35cm", change: "+1.5cm", trend: "up" },
                  { name: "Thighs", current: "58cm", change: "+3cm", trend: "up" },
                  { name: "Shoulders", current: "112cm", change: "+2.5cm", trend: "up" },
                  { name: "Hips", current: "95cm", change: "0cm", trend: "stable" },
                  { name: "Neck", current: "38cm", change: "+0.5cm", trend: "up" },
                  { name: "Calves", current: "38cm", change: "+1cm", trend: "up" }
                ].map((measurement, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm" style={{ color: '#000000' }}>{measurement.name}</h4>
                      <span className={`text-xs font-medium ${
                        measurement.trend === 'up' ? 'text-green-600' : 
                        measurement.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {measurement.change}
                      </span>
                    </div>
                    <div className="text-lg font-bold" style={{ color: '#000000' }}>{measurement.current}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Performance Metrics
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strength Progress */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Strength Progress (Last 3 Months)</h4>
                  <div className="space-y-4">
                    {[
                      { exercise: "Bench Press", current: "85kg", previous: "75kg", improvement: "+13%" },
                      { exercise: "Squat", current: "120kg", previous: "105kg", improvement: "+14%" },
                      { exercise: "Deadlift", current: "140kg", previous: "125kg", improvement: "+12%" },
                      { exercise: "Overhead Press", current: "55kg", previous: "50kg", improvement: "+10%" }
                    ].map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm" style={{ color: '#000000' }}>{exercise.exercise}</div>
                          <div className="text-xs text-gray-600">{exercise.previous} → {exercise.current}</div>
                        </div>
                        <div className="text-green-600 font-semibold text-sm">{exercise.improvement}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Endurance Metrics */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Endurance Metrics</h4>
                  <div className="space-y-4">
                    {[
                      { metric: "Max Heart Rate", value: "185 bpm", zone: "Peak" },
                      { metric: "Resting HR", value: "58 bpm", zone: "Excellent" },
                      { metric: "VO2 Max", value: "52 ml/kg/min", zone: "Good" },
                      { metric: "Recovery Time", value: "24 hours", zone: "Fast" }
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm" style={{ color: '#000000' }}>{metric.metric}</div>
                          <div className="text-xs text-gray-600">{metric.zone}</div>
                        </div>
                        <div className="font-semibold text-sm" style={{ color: '#000000' }}>{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Analytics Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Nutrition Analytics
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Macro Distribution */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Macro Distribution (Today)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm" style={{ color: '#000000' }}>Protein</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm" style={{ color: '#000000' }}>Carbs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>50%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm" style={{ color: '#000000' }}>Fats</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#000000' }}>20%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hydration & Supplements */}
                <div>
                  <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Hydration & Supplements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm" style={{ color: '#000000' }}>Water Intake</div>
                        <div className="text-xs text-gray-600">Today's goal: 3L</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">2.4L</div>
                        <div className="text-xs text-gray-600">80%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm" style={{ color: '#000000' }}>Protein Shake</div>
                        <div className="text-xs text-gray-600">Post-workout</div>
                      </div>
                      <div className="text-green-600">✓</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm" style={{ color: '#000000' }}>Creatine</div>
                        <div className="text-xs text-gray-600">Daily supplement</div>
                      </div>
                      <div className="text-purple-600">✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Workout Plan Section */}
          <section id="workout" className="min-h-screen mb-16 pt-12">
            <div className="mb-8">
              <h2 className="text-4xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Workout Plan
              </h2>
              <div className="w-16 h-0.5 bg-gray-300"></div>
        </div>

            {/* Weekly Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
            Weekly Schedule
              </h3>
          <div className="grid grid-cols-7 gap-2">
            {weeklySchedule.map((day, index) => (
              <div
                key={day.day}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedDay === day.day
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : day.completed
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
              >
                <div className="text-center">
                      <div className="text-sm font-medium mb-1" style={{ color: '#000000' }}>{day.day}</div>
                      <div className="text-sm font-semibold mb-1" style={{ color: '#000000' }}>{day.workout}</div>
                      <div className="text-xs" style={{ color: '#000000' }}>{day.location}</div>
                  {day.completed && <div className="text-green-600 text-xs mt-1">✓ Done</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

            {/* Exercise Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 max-h-[600px] flex flex-col">
              {/* Day Summary */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 h-[80px] flex flex-col justify-center flex-shrink-0">
                {selectedDay ? (
                  <>
                    <h4 className="font-semibold mb-1" style={{ color: '#000000' }}>
                      {weeklySchedule.find(d => d.day === selectedDay)?.workout} - {weeklySchedule.find(d => d.day === selectedDay)?.location}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#000000' }}>
                      {getWorkoutDescription(selectedDay)}
                    </p>
                  </>
                ) : (
                  <div className="text-center" style={{ color: '#000000' }}>
                    <div className="text-2xl mb-2">🏋️</div>
                    <p>Select a workout day to see details</p>
                  </div>
                )}
              </div>

              {/* Exercise List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
            {selectedDay ? (
              getExercisesForDay(selectedDay).map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                          <h4 className="font-semibold" style={{ color: '#000000' }}>{exercise.name}</h4>
                          <p className="text-sm" style={{ color: '#000000' }}>{exercise.sets} • {exercise.reps}</p>
                    </div>
                    <div className="text-gray-400">
                      {expandedExercise === exercise.id ? '▼' : '▶'}
                    </div>
                  </div>

                  {expandedExercise === exercise.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                              <h5 className="font-medium mb-2" style={{ color: '#000000' }}>AI Form Tips:</h5>
                              <p className="text-sm mb-3" style={{ color: '#000000' }}>{exercise.tips}</p>
                              <h5 className="font-medium mb-2" style={{ color: '#000000' }}>Equipment Location:</h5>
                              <p className="text-sm" style={{ color: '#000000' }}>{exercise.equipment}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">📹</div>
                            <div className="text-sm">Preview Video</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
                ) : null}
              </div>
            </div>
          </section>

          {/* Nutrition Plan Section */}
          <section id="nutrition" className="min-h-screen mb-16 pt-12">
            <div className="mb-8">
              <h2 className="text-4xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Nutrition Plan
              </h2>
              <div className="w-16 h-0.5 bg-gray-300"></div>
            </div>

            {/* Daily Nutrition Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Daily Nutrition
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Daily Calories</h4>
                    <div className="text-green-600">🔥</div>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>2,200</div>
                  <div className="text-xs" style={{ color: '#000000' }}>kcal</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Protein</h4>
                    <div className="text-blue-600">🥩</div>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>165g</div>
                  <div className="text-xs" style={{ color: '#000000' }}>per day</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Carbs</h4>
                    <div className="text-orange-600">🍞</div>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>275g</div>
                  <div className="text-xs" style={{ color: '#000000' }}>per day</div>
                </div>
              </div>

              {/* Meal Recommendations */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Recommended Meals</h4>
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                  {[
                    {
                      name: "Grilled Chicken Breast with Quinoa",
                      calories: 420,
                      diningHall: "Scott Traditions",
                      description: "Lean protein with complex carbs"
                    },
                    {
                      name: "Salmon Bowl with Sweet Potato",
                      calories: 380,
                      diningHall: "Kennedy Commons",
                      description: "Omega-3 rich with beta-carotene"
                    },
                    {
                      name: "Greek Yogurt Parfait",
                      calories: 280,
                      diningHall: "Morrill Traditions",
                      description: "High protein breakfast option"
                    },
                    {
                      name: "Turkey & Avocado Wrap",
                      calories: 350,
                      diningHall: "Scott Traditions",
                      description: "Balanced macros for lunch"
                    },
                    {
                      name: "Oatmeal with Berries",
                      calories: 320,
                      diningHall: "Kennedy Commons",
                      description: "Fiber-rich morning fuel"
                    },
                    {
                      name: "Grilled Fish Tacos",
                      calories: 410,
                      diningHall: "Morrill Traditions",
                      description: "Lean protein with fresh veggies"
                    },
                    {
                      name: "Protein Smoothie Bowl",
                      calories: 290,
                      diningHall: "Scott Traditions",
                      description: "Post-workout recovery meal"
                    },
                    {
                      name: "Chicken Caesar Salad",
                      calories: 340,
                      diningHall: "Kennedy Commons",
                      description: "Classic with lean protein"
                    },
                    {
                      name: "Veggie Stir Fry with Brown Rice",
                      calories: 360,
                      diningHall: "Morrill Traditions",
                      description: "Plant-based protein option"
                    },
                    {
                      name: "Egg White Omelet",
                      calories: 250,
                      diningHall: "Scott Traditions",
                      description: "High protein, low calorie"
                    },
                    {
                      name: "Grilled Turkey Burger",
                      calories: 390,
                      diningHall: "Kennedy Commons",
                      description: "Lean protein with whole grain bun"
                    },
                    {
                      name: "Quinoa Buddha Bowl",
                      calories: 430,
                      diningHall: "Morrill Traditions",
                      description: "Complete amino acid profile"
                    }
                  ].map((meal, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm" style={{ color: '#000000' }}>{meal.name}</h5>
                        <span className="text-sm font-semibold text-blue-600">{meal.calories} cal</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">📍 {meal.diningHall}</span>
                        <span style={{ color: '#000000' }}>{meal.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
          </section>
        </div>
      </div>
    </div>
  );
}