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
        equipment: "Barbell - RPAC Floor 2, Rack 3"
      },
      {
        id: "incline-dumbbell-press",
        name: "Incline Dumbbell Press",
        sets: "3 sets",
        reps: "10-12 reps",
        tips: "Control the weight and focus on the stretch at the bottom",
        equipment: "Dumbbells - RPAC Floor 2"
      },
      {
        id: "tricep-dips",
        name: "Tricep Dips",
        sets: "3 sets",
        reps: "10-12 reps",
        tips: "Keep elbows close to body and lean slightly forward",
        equipment: "Dip Station - RPAC Floor 2"
      },
      {
        id: "overhead-press",
        name: "Overhead Press",
        sets: "3 sets",
        reps: "8-10 reps",
        tips: "Keep core engaged and press straight up",
        equipment: "Barbell - RPAC Floor 2"
      }
    ],
    "Wed": [
      {
        id: "deadlift",
        name: "Deadlift",
        sets: "4 sets",
        reps: "5-8 reps",
        tips: "Keep your back straight and drive through your heels",
        equipment: "Barbell - RPAC Floor 2"
      },
      {
        id: "pull-ups",
        name: "Pull-ups",
        sets: "3 sets",
        reps: "8-12 reps",
        tips: "Full range of motion, control the descent",
        equipment: "Pull-up Bar - RPAC Floor 2"
      },
      {
        id: "barbell-rows",
        name: "Barbell Rows",
        sets: "3 sets",
        reps: "10-12 reps",
        tips: "Pull to your lower chest, squeeze shoulder blades",
        equipment: "Barbell - RPAC Floor 2"
      },
      {
        id: "bicep-curls",
        name: "Bicep Curls",
        sets: "3 sets",
        reps: "12-15 reps",
        tips: "Control the weight, full range of motion",
        equipment: "Dumbbells - RPAC Floor 2"
      }
    ],
    "Fri": [
      {
        id: "squats",
        name: "Squats",
        sets: "4 sets",
        reps: "8-12 reps",
        tips: "Keep chest up, go below parallel",
        equipment: "Barbell - RPAC Floor 1, Rack 1"
      },
      {
        id: "romanian-deadlifts",
        name: "Romanian Deadlifts",
        sets: "3 sets",
        reps: "10-12 reps",
        tips: "Keep legs straight, feel the stretch in hamstrings",
        equipment: "Barbell - RPAC Floor 1"
      },
      {
        id: "bulgarian-split-squats",
        name: "Bulgarian Split Squats",
        sets: "3 sets",
        reps: "10-12 reps each leg",
        tips: "Keep front knee over ankle, control the movement",
        equipment: "Bodyweight - RPAC Floor 1"
      },
      {
        id: "calf-raises",
        name: "Calf Raises",
        sets: "4 sets",
        reps: "15-20 reps",
        tips: "Full range of motion, pause at the top",
        equipment: "Bodyweight - RPAC Floor 1"
      }
    ]
  };

  const getExercisesForDay = (day: string) => {
    return dayExercises[day as keyof typeof dayExercises] || [];
  };

  const getWorkoutDescription = (day: string) => {
    const descriptions = {
      "Mon": "Focus on chest, shoulders, and triceps. This push workout builds upper body strength and muscle mass through compound movements like bench press and overhead press.",
      "Wed": "Target your back and biceps with pulling movements. This workout strengthens your posterior chain and improves posture through deadlifts and rowing exercises.",
      "Fri": "Build lower body strength and power. This leg day targets your quads, hamstrings, glutes, and calves for a complete lower body workout.",
      "Tue": "Gentle stretching and mobility work to improve flexibility and aid recovery from your strength training sessions.",
      "Thu": "Cardiovascular training to improve heart health, endurance, and overall fitness. Great for burning calories and boosting energy.",
      "Sat": "Active recovery day with light movement, stretching, or rest to allow your muscles to repair and grow stronger.",
      "Sun": "Complete rest day. Your body needs time to recover and adapt to the training stimulus for optimal results."
    };
    return descriptions[day as keyof typeof descriptions] || "Select a workout day to see details.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Workout Plan
          </h1>
          <div className="w-16 h-0.5 bg-gray-300"></div>
        </div>

        {/* Section 1: Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Summary
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Based on your body composition and goals, we've designed a 4-day split focused on upper/lower balance,
            core stability, and conditioning at RPAC. This plan will help you build strength while improving
            your overall fitness foundation.
          </p>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Regenerate Plan
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
              Adjust Goal
            </button>
          </div>
        </div>

        {/* Section 2: Analytics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-gray-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Analytics
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* BMI Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">BMI</h3>
                <div className="text-blue-600">📊</div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">22.4</div>
              <div className="text-xs text-gray-600">Healthy Range</div>
            </div>

            {/* Body Fat % Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Body Fat %</h3>
                <div className="text-green-600">💪</div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">15.2%</div>
              <div className="text-xs text-gray-600">Good</div>
            </div>

            {/* Muscle Mass Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Muscle Mass</h3>
                <div className="text-purple-600">🏋️</div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">68.5kg</div>
              <div className="text-xs text-gray-600">Above Average</div>
            </div>

            {/* Fitness Score Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Fitness Score</h3>
                <div className="text-orange-600">⭐</div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">8.2/10</div>
              <div className="text-xs text-gray-600">Excellent</div>
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Areas to Focus On</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Upper Body Strength</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-gray-600 text-xs">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Core Stability</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-gray-600 text-xs">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Flexibility</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-gray-600 text-xs">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Cardiovascular Endurance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-gray-600 text-xs">35%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Nutrition Plan */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-gray-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Nutrition Plan
          </h2>
          
          {/* Daily Nutrition Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Daily Calories</h3>
                <div className="text-green-600">🔥</div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">2,200</div>
              <div className="text-xs text-gray-600">kcal</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Protein</h3>
                <div className="text-blue-600">🥩</div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">165g</div>
              <div className="text-xs text-gray-600">per day</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Carbs</h3>
                <div className="text-orange-600">🍞</div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">275g</div>
              <div className="text-xs text-gray-600">per day</div>
            </div>
          </div>

          {/* Weekly Meal Schedule */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Weekly Meal Schedule</h3>
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
                    <div className="text-sm font-medium text-gray-600 mb-1">{day.day}</div>
                    <div className="text-sm font-semibold text-gray-800 mb-1">{day.meals}</div>
                    <div className="text-xs text-gray-500">{day.focus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Meals */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Sample Meals</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Breakfast</h4>
                <p className="text-xs text-gray-600 mb-1">• Oatmeal with berries & protein powder</p>
                <p className="text-xs text-gray-600 mb-1">• Greek yogurt with nuts</p>
                <p className="text-xs text-gray-600">• 2 whole eggs</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Lunch</h4>
                <p className="text-xs text-gray-600 mb-1">• Grilled chicken breast</p>
                <p className="text-xs text-gray-600 mb-1">• Quinoa & vegetables</p>
                <p className="text-xs text-gray-600">• Mixed green salad</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Dinner</h4>
                <p className="text-xs text-gray-600 mb-1">• Salmon fillet</p>
                <p className="text-xs text-gray-600 mb-1">• Sweet potato & broccoli</p>
                <p className="text-xs text-gray-600">• Avocado</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Snacks</h4>
                <p className="text-xs text-gray-600 mb-1">• Protein shake</p>
                <p className="text-xs text-gray-600 mb-1">• Almonds & fruit</p>
                <p className="text-xs text-gray-600">• Cottage cheese</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Weekly Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-gray-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Weekly Schedule
          </h2>
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
                  <div className="text-sm font-medium text-gray-600 mb-1">{day.day}</div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">{day.workout}</div>
                  <div className="text-xs text-gray-500">{day.location}</div>
                  {day.completed && <div className="text-green-600 text-xs mt-1">✓ Done</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Exercise Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 min-h-[600px]">
          <h2 className="text-xl font-semibold text-gray-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Exercise Details
          </h2>
          
          {/* Day Summary - Always show, with consistent height */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 min-h-[80px] flex flex-col justify-center">
            {selectedDay ? (
              <>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {weeklySchedule.find(d => d.day === selectedDay)?.workout} - {weeklySchedule.find(d => d.day === selectedDay)?.location}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {getWorkoutDescription(selectedDay)}
                </p>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">🏋️</div>
                <p>Select a workout day to see details</p>
              </div>
            )}
          </div>

          {/* Exercise List - Fixed height container */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {selectedDay ? (
              getExercisesForDay(selectedDay).map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                      <p className="text-sm text-gray-600">{exercise.sets} • {exercise.reps}</p>
                    </div>
                    <div className="text-gray-400">
                      {expandedExercise === exercise.id ? '▼' : '▶'}
                    </div>
                  </div>

                  {expandedExercise === exercise.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">AI Form Tips:</h4>
                          <p className="text-sm text-gray-600 mb-3">{exercise.tips}</p>
                          <h4 className="font-medium text-gray-700 mb-2">Equipment Location:</h4>
                          <p className="text-sm text-gray-600">{exercise.equipment}</p>
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
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🏋️</div>
                <p>Select a workout day to see exercises</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}