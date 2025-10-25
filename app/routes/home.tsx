import type { Route } from "./+types/home";
import { useState } from "react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Vertical Navigation Bar */}
      <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
            FitAI
          </h1>
          <div className="w-12 h-0.5 bg-gray-300"></div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => scrollToSection('analytics')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === 'analytics'
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-gray-100'
            }`}
            style={{ color: '#000000' }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">📊</span>
              <span className="font-medium">Analytics</span>
            </div>
            </button>
          
          <button
            onClick={() => scrollToSection('workout')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === 'workout'
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-gray-100'
            }`}
            style={{ color: '#000000' }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">🏋️</span>
              <span className="font-medium">Workout Plan</span>
            </div>
            </button>
          
          <button
            onClick={() => scrollToSection('nutrition')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === 'nutrition'
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-gray-100'
            }`}
            style={{ color: '#000000' }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">🍎</span>
              <span className="font-medium">Nutrition Plan</span>
          </div>
          </button>
        </nav>
        </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">

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
          </section>

          {/* Workout Plan Section */}
          <section id="workout" className="min-h-screen mb-16 pt-8">
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
          <section id="nutrition" className="min-h-screen mb-16 pt-8">
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

              {/* Weekly Meal Schedule */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 text-sm" style={{ color: '#000000' }}>Weekly Meal Schedule</h4>
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { day: "Mon", meals: "High Protein", focus: "Muscle Building" },
                    { day: "Tue", meals: "Balanced", focus: "Recovery" },
                    { day: "Wed", meals: "High Protein", focus: "Muscle Building" },
                    { day: "Thu", meals: "Light", focus: "Cardio Fuel" },
                    { day: "Fri", meals: "High Protein", focus: "Muscle Building" },
                    { day: "Sat", meals: "Flexible", focus: "Cheat Day" },
                    { day: "Sun", meals: "Balanced", focus: "Recovery" }
                  ].map((day, index) => (
                    <div
                      key={day.day}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedDay === day.day
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium mb-1" style={{ color: '#000000' }}>{day.day}</div>
                        <div className="text-sm font-semibold mb-1" style={{ color: '#000000' }}>{day.meals}</div>
                        <div className="text-xs" style={{ color: '#000000' }}>{day.focus}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Meals */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#000000' }}>Sample Meals</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2 text-sm" style={{ color: '#000000' }}>Breakfast</h5>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Oatmeal with berries & protein powder</p>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Greek yogurt with nuts</p>
                    <p className="text-xs" style={{ color: '#000000' }}>• 2 whole eggs</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 text-sm" style={{ color: '#000000' }}>Lunch</h5>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Grilled chicken breast</p>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Quinoa & vegetables</p>
                    <p className="text-xs" style={{ color: '#000000' }}>• Mixed green salad</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 text-sm" style={{ color: '#000000' }}>Dinner</h5>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Salmon fillet</p>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Sweet potato & broccoli</p>
                    <p className="text-xs" style={{ color: '#000000' }}>• Avocado</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 text-sm" style={{ color: '#000000' }}>Snacks</h5>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Protein shake</p>
                    <p className="text-xs mb-1" style={{ color: '#000000' }}>• Almonds & fruit</p>
                    <p className="text-xs" style={{ color: '#000000' }}>• Cottage cheese</p>
                  </div>
                </div>
              </div>
          </div>
          </section>
        </div>
      </div>
    </div>
  );
}