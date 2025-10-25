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

  // Add CSS for fade-in animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  // Hardcoded fitness analysis data for 6ft, 170lbs, 20yo, beginner, gain muscle, male
  const fitnessAnalysis = {
    bmi: {
      value: 23.1,
      category: "Normal Weight",
      description: "Your BMI indicates a healthy weight range for muscle building"
    },
    bodyFatPercentage: {
      value: 15.2,
      category: "Athletic",
      description: "Great foundation for muscle gain with room for lean mass development"
    },
    muscleMass: {
      value: 144.2,
      unit: "lbs",
      description: "Solid muscle base with excellent potential for growth"
    },
    fitnessScore: {
      value: 72,
      max: 100,
      category: "Good",
      description: "Strong starting point for your muscle building journey"
    },
    areasToFocus: ["chest", "back", "legs", "shoulders"],
    workoutPlan: {
      monday: {
        focus: "Upper Body Strength",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "4-6", rest: "3-4 minutes" },
          { name: "Weighted Pull-ups", sets: 4, reps: "4-6", rest: "3-4 minutes" },
          { name: "Overhead Press", sets: 4, reps: "5-7", rest: "3-4 minutes" },
          { name: "Barbell Rows", sets: 4, reps: "5-7", rest: "3-4 minutes" }
        ]
      },
      tuesday: {
        focus: "Lower Body Power",
        exercises: [
          { name: "Back Squats", sets: 5, reps: "3-5", rest: "4-5 minutes" },
          { name: "Deadlifts", sets: 4, reps: "3-5", rest: "4-5 minutes" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "6-8 each leg", rest: "2-3 minutes" },
          { name: "Calf Raises", sets: 4, reps: "8-12", rest: "2 minutes" }
        ]
      },
      wednesday: {
        focus: "Rest Day",
        exercises: [
          { name: "Light stretching or yoga", sets: 1, reps: "20-30 minutes", rest: "N/A" }
        ]
      },
      thursday: {
        focus: "Push Day",
        exercises: [
          { name: "Incline Bench Press", sets: 4, reps: "4-6", rest: "3-4 minutes" },
          { name: "Weighted Dips", sets: 4, reps: "5-8", rest: "3-4 minutes" },
          { name: "Military Press", sets: 4, reps: "5-7", rest: "3-4 minutes" },
          { name: "Close Grip Bench Press", sets: 3, reps: "6-8", rest: "2-3 minutes" }
        ]
      },
      friday: {
        focus: "Pull Day",
        exercises: [
          { name: "Weighted Chin-ups", sets: 4, reps: "4-6", rest: "3-4 minutes" },
          { name: "Pendlay Rows", sets: 4, reps: "5-7", rest: "3-4 minutes" },
          { name: "Face Pulls", sets: 3, reps: "8-12", rest: "2 minutes" },
          { name: "Barbell Curls", sets: 3, reps: "6-8", rest: "2-3 minutes" }
        ]
      },
      saturday: {
        focus: "Legs & Core",
        exercises: [
          { name: "Front Squats", sets: 4, reps: "5-7", rest: "3-4 minutes" },
          { name: "Romanian Deadlifts", sets: 4, reps: "5-7", rest: "3-4 minutes" },
          { name: "Weighted Planks", sets: 3, reps: "30-45 seconds", rest: "2 minutes" },
          { name: "Hanging Leg Raises", sets: 3, reps: "8-12", rest: "2 minutes" }
        ]
      },
      sunday: {
        focus: "Active Recovery",
        exercises: [
          { name: "Light cardio or walking", sets: 1, reps: "30-45 minutes", rest: "N/A" }
        ]
      }
    },
    nutrition: {
      tdee: 2450,
      macros: {
        protein: 170,
        carbs: 245,
        fats: 82
      },
      meals: {
        breakfast: {
          name: "Dining Hall: Scrambled Eggs & Oatmeal",
          calories: 520,
          protein: 30,
          carbs: 55,
          fats: 15,
          ingredients: ["2-3 scrambled eggs", "1 cup oatmeal", "1 banana", "1 tbsp peanut butter", "1 cup milk"],
          location: "Scott Commons or Kennedy Commons"
        },
        lunch: {
          name: "Dining Hall: Grilled Chicken & Rice",
          calories: 580,
          protein: 45,
          carbs: 35,
          fats: 25,
          ingredients: ["Grilled chicken breast", "Brown rice", "Steamed vegetables", "Mixed salad", "Olive oil"],
          location: "Scott Commons or Kennedy Commons"
        },
        dinner: {
          name: "Dining Hall: Salmon & Sweet Potato",
          calories: 650,
          protein: 50,
          carbs: 60,
          fats: 30,
          ingredients: ["Grilled salmon", "Baked sweet potato", "Steamed broccoli", "Quinoa", "Olive oil"],
          location: "Scott Commons or Kennedy Commons"
        },
        snacks: [
          {
            name: "Dining Hall: Greek Yogurt Parfait",
            calories: 250,
            protein: 20,
            carbs: 30,
            fats: 8,
            location: "Campus Market or Dining Hall"
          },
          {
            name: "Dining Hall: Protein Smoothie",
            calories: 300,
            protein: 30,
            carbs: 20,
            fats: 10,
            location: "Smoothie Bar at Scott Commons"
          }
        ]
      },
      diningHalls: {
        scottCommons: {
          name: "Scott Commons",
          hours: "7:00 AM - 9:00 PM (Mon-Fri), 9:00 AM - 8:00 PM (Weekends)",
          features: ["Grill Station", "Salad Bar", "Pizza Station", "Smoothie Bar", "Dessert Station"],
          bestFor: ["Protein options", "Fresh vegetables", "Custom meals"]
        },
        kennedyCommons: {
          name: "Kennedy Commons", 
          hours: "7:00 AM - 9:00 PM (Mon-Fri), 9:00 AM - 8:00 PM (Weekends)",
          features: ["International Cuisine", "Grill Station", "Salad Bar", "Pasta Station", "Dessert Station"],
          bestFor: ["Variety", "International dishes", "Vegetarian options"]
        },
        campusMarket: {
          name: "Campus Market",
          hours: "24/7",
          features: ["Grab & Go", "Fresh Produce", "Protein Bars", "Smoothies", "Snacks"],
          bestFor: ["Quick meals", "Snacks", "Late night options"]
        }
      }
    }
  };

  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Simple loading effect
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
    }, 80);

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

  // Use hardcoded fitness analysis data
  const weeklySchedule = [
    { day: "Mon", workout: "Upper Body", location: "RPAC Floor 1", completed: false },
    { day: "Tue", workout: "Lower Body", location: "RPAC Floor 1", completed: false },
    { day: "Wed", workout: fitnessAnalysis.workoutPlan.wednesday.focus, location: "Home", completed: false },
    { day: "Thu", workout: fitnessAnalysis.workoutPlan.thursday.focus, location: "JO North", completed: false },
    { day: "Fri", workout: fitnessAnalysis.workoutPlan.friday.focus, location: "North Rec Center", completed: false },
    { day: "Sat", workout: fitnessAnalysis.workoutPlan.saturday.focus, location: "RPAC Floor 1", completed: false },
    { day: "Sun", workout: fitnessAnalysis.workoutPlan.sunday.focus, location: "Home", completed: false },
  ];

  // Generate exercises from hardcoded fitness analysis data
  const getDayExercises = (day: string) => {
    // Map day names to workout plan keys
    const dayMap: { [key: string]: string } = {
      "Mon": "monday",
      "Tue": "tuesday", 
      "Wed": "wednesday",
      "Thu": "thursday",
      "Fri": "friday",
      "Sat": "saturday",
      "Sun": "sunday"
    };

    const workoutDay = dayMap[day];
    const dayWorkout = fitnessAnalysis.workoutPlan[workoutDay as keyof typeof fitnessAnalysis.workoutPlan];
    
    if (!dayWorkout?.exercises) return [];

    return dayWorkout.exercises.map((exercise: { name: string; sets: number; reps: string; rest: string }, index: number) => ({
      id: `${day.toLowerCase()}-exercise-${index}`,
      name: exercise.name,
      sets: `${exercise.sets} sets`,
      reps: exercise.reps,
      tips: `Rest ${exercise.rest} between sets`,
      equipment: "RPAC 1st Floor, Back Right Corner"
    }));
  };

  const dayExercises = {
    "Mon": getDayExercises("Mon"),
    "Tue": getDayExercises("Tue"),
    "Wed": getDayExercises("Wed"),
    "Thu": getDayExercises("Thu"),
    "Fri": getDayExercises("Fri"),
    "Sat": getDayExercises("Sat"),
    "Sun": getDayExercises("Sun")
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex opacity-0 animate-[fadeIn_1s_ease-in-out_forwards]">
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

            {/* Summary Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Your Fitness Summary
              </h3>
              
              {analysisError ? (
                <div className="text-center py-4">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-red-600">{analysisError}</p>
                </div>
              ) : fitnessAnalysis ? (
                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <p className="text-base leading-relaxed" style={{ color: '#000000' }}>
                    Your analysis shows you're already at a great start at at 170 lbs and 6'0" with a BMI of 23.1 and 15.2% body fat. Your fitness score of 72/100 indicates incredible potential. We've tailored your workout to focus on chest and back, with low reps and higher intensity to build muscle. Let's make this your best fitness year yet.
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading your summary...</p>
                </div>
              )}
            </div>

            {/* Body Composition Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 mb-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Body Composition Analysis
              </h3>
          
              {analysisError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-red-600">{analysisError}</p>
                </div>
              ) : fitnessAnalysis ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {/* BMI Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>BMI</h4>
                        <div className="text-blue-600">📊</div>
                      </div>
                      <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>
                        {fitnessAnalysis.bmi?.value || 'N/A'}
                      </div>
                      <div className="text-xs" style={{ color: '#000000' }}>
                        {fitnessAnalysis.bmi?.category || 'Calculating...'}
                      </div>
                    </div>

                    {/* Body Fat % Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Body Fat %</h4>
                        <div className="text-green-600">💪</div>
                      </div>
                      <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>
                        {fitnessAnalysis.bodyFatPercentage?.value || 'N/A'}%
                      </div>
                      <div className="text-xs" style={{ color: '#000000' }}>
                        {fitnessAnalysis.bodyFatPercentage?.category || 'Calculating...'}
                      </div>
                    </div>

                    {/* Muscle Mass Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Muscle Mass</h4>
                        <div className="text-purple-600">🏋️</div>
                      </div>
                      <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>
                        76 lbs
                      </div>
                      <div className="text-xs" style={{ color: '#000000' }}>
                        {fitnessAnalysis.muscleMass?.description || 'Calculating...'}
                      </div>
                    </div>

                    {/* Fitness Score Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm" style={{ color: '#000000' }}>Fitness Score</h4>
                        <div className="text-orange-600">⭐</div>
                      </div>
                      <div className="text-2xl font-bold mb-1" style={{ color: '#000000' }}>
                        {fitnessAnalysis.fitnessScore?.value || 'N/A'}/{fitnessAnalysis.fitnessScore?.max || '10'}
                      </div>
                      <div className="text-xs" style={{ color: '#000000' }}>
                        {fitnessAnalysis.fitnessScore?.category || 'Calculating...'}
                      </div>
                    </div>
                  </div>

                  {/* Areas to Focus On */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-3 text-base" style={{ color: '#000000' }}>Areas to Focus On</h4>
                    <div className="space-y-2">
                      {fitnessAnalysis.areasToFocus && fitnessAnalysis.areasToFocus.length > 0 ? (
                        fitnessAnalysis.areasToFocus.map((area: string, index: number) => (
                          <div key={index} className="flex items-center justify-between text-base">
                            <span style={{ color: '#000000' }} className="capitalize">{area.replace('-', ' ')}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${Math.random() * 40 + 40}%` }}
                                ></div>
                              </div>
                              <span className="text-xs" style={{ color: '#000000' }}>
                                {Math.floor(Math.random() * 40 + 40)}%
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>No specific areas identified yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your fitness data...</p>
                </div>
              )}
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/20 flex flex-col">
              {/* Day Summary */}
              <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200 h-[70px] flex flex-col justify-center flex-shrink-0">
                {selectedDay ? (
                  <>
                    <h4 className="font-semibold mb-1" style={{ color: '#000000' }}>
                      {weeklySchedule.find(d => d.day === selectedDay)?.workout} - {weeklySchedule.find(d => d.day === selectedDay)?.location}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#000000' }}>
                      {getWorkoutDescription(selectedDay || "")}
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
              <div className="space-y-2 flex-1 overflow-y-auto">
                {selectedDay ? (
                  getExercisesForDay(selectedDay || "").map((exercise: any) => (
                    <div
                      key={exercise.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold" style={{ color: '#000000' }}>{exercise.name}</h4>
                          <p className="text-sm" style={{ color: '#000000' }}>3 sets • {exercise.reps}</p>
                        </div>
                        <div className="text-gray-400">
                          {expandedExercise === exercise.id ? '▼' : '▶'}
                        </div>
                      </div>

                      {expandedExercise === exercise.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-1" style={{ color: '#000000' }}>Form Tips:</h5>
                              <p className="text-sm mb-2" style={{ color: '#000000' }}>Keep your feet planted, squeeze your shoulder blades together, and lower the bar to your mid-chest in a controlled motion before pressing back up explosively.</p>
                              <h5 className="font-medium mb-1" style={{ color: '#000000' }}>Equipment Location:</h5>
                              <p className="text-sm" style={{ color: '#000000' }}>{exercise.equipment}</p>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
                              {exercise.name === "Bench Press" ? (
                                <video 
                                  className="w-full aspect-square rounded-lg object-cover"
                                  controls
                                  preload="metadata"
                                >
                                  <source src="/bench press video.mp4" type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <div className="text-center text-gray-500">
                                  <div className="text-4xl mb-2">📹</div>
                                  <div className="text-sm">Preview Video</div>
                                </div>
                              )}
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
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}>
                Daily Nutrition
              </h3>
              
              {fitnessAnalysis?.nutrition ? (
                <>
                  <div className="grid md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-xs" style={{ color: '#000000' }}>Calories</h4>
                        <div className="text-green-600 text-sm">🔥</div>
                      </div>
                      <div className="text-lg font-bold" style={{ color: '#000000' }}>
                        {fitnessAnalysis.nutrition.tdee || 'N/A'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-xs" style={{ color: '#000000' }}>Protein</h4>
                        <div className="text-blue-600 text-sm">🥩</div>
                      </div>
                      <div className="text-lg font-bold" style={{ color: '#000000' }}>
                        {fitnessAnalysis.nutrition.macros?.protein || 'N/A'}g
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-xs" style={{ color: '#000000' }}>Carbs</h4>
                        <div className="text-orange-600 text-sm">🍞</div>
                      </div>
                      <div className="text-lg font-bold" style={{ color: '#000000' }}>
                        {fitnessAnalysis.nutrition.macros?.carbs || 'N/A'}g
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-xs" style={{ color: '#000000' }}>Fats</h4>
                        <div className="text-purple-600 text-sm">🥑</div>
                      </div>
                      <div className="text-lg font-bold" style={{ color: '#000000' }}>
                        {fitnessAnalysis.nutrition.macros?.fats || 'N/A'}g
                      </div>
                    </div>
                  </div>

                  {/* Compact Meal Recommendations */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold mb-3 text-sm" style={{ color: '#000000' }}>Sample Meals</h4>
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {fitnessAnalysis?.nutrition?.meals ? (
                        <>
                          {/* Breakfast */}
                          {fitnessAnalysis.nutrition.meals.breakfast && (
                            <div className="bg-white rounded p-2 border border-gray-200">
                              <div className="flex justify-between items-center mb-1">
                                <h5 className="font-medium text-xs" style={{ color: '#000000' }}>
                                  {fitnessAnalysis.nutrition.meals.breakfast.name}
                                </h5>
                                <span className="text-xs text-gray-600">
                                  {fitnessAnalysis.nutrition.meals.breakfast.calories} cal
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 mb-1">
                                P: {fitnessAnalysis.nutrition.meals.breakfast.protein}g | 
                                C: {fitnessAnalysis.nutrition.meals.breakfast.carbs}g | 
                                F: {fitnessAnalysis.nutrition.meals.breakfast.fats}g
                              </div>
                              <div className="text-xs text-blue-600 mb-1">
                                📍 {fitnessAnalysis.nutrition.meals.breakfast.location}
                              </div>
                              <div className="text-xs text-gray-500">
                                {fitnessAnalysis.nutrition.meals.breakfast.ingredients?.join(' • ')}
                              </div>
                            </div>
                          )}

                          {/* Lunch */}
                          {fitnessAnalysis.nutrition.meals.lunch && (
                            <div className="bg-white rounded p-2 border border-gray-200">
                              <div className="flex justify-between items-center mb-1">
                                <h5 className="font-medium text-xs" style={{ color: '#000000' }}>
                                  {fitnessAnalysis.nutrition.meals.lunch.name}
                                </h5>
                                <span className="text-xs text-gray-600">
                                  {fitnessAnalysis.nutrition.meals.lunch.calories} cal
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 mb-1">
                                P: {fitnessAnalysis.nutrition.meals.lunch.protein}g | 
                                C: {fitnessAnalysis.nutrition.meals.lunch.carbs}g | 
                                F: {fitnessAnalysis.nutrition.meals.lunch.fats}g
                              </div>
                              <div className="text-xs text-blue-600 mb-1">
                                📍 {fitnessAnalysis.nutrition.meals.lunch.location}
                              </div>
                              <div className="text-xs text-gray-500">
                                {fitnessAnalysis.nutrition.meals.lunch.ingredients?.join(' • ')}
                              </div>
                            </div>
                          )}

                          {/* Dinner */}
                          {fitnessAnalysis.nutrition.meals.dinner && (
                            <div className="bg-white rounded p-2 border border-gray-200">
                              <div className="flex justify-between items-center mb-1">
                                <h5 className="font-medium text-xs" style={{ color: '#000000' }}>
                                  {fitnessAnalysis.nutrition.meals.dinner.name}
                                </h5>
                                <span className="text-xs text-gray-600">
                                  {fitnessAnalysis.nutrition.meals.dinner.calories} cal
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 mb-1">
                                P: {fitnessAnalysis.nutrition.meals.dinner.protein}g | 
                                C: {fitnessAnalysis.nutrition.meals.dinner.carbs}g | 
                                F: {fitnessAnalysis.nutrition.meals.dinner.fats}g
                              </div>
                              <div className="text-xs text-blue-600 mb-1">
                                📍 {fitnessAnalysis.nutrition.meals.dinner.location}
                              </div>
                              <div className="text-xs text-gray-500">
                                {fitnessAnalysis.nutrition.meals.dinner.ingredients?.join(' • ')}
                              </div>
                            </div>
                          )}

                          {/* Snacks */}
                          {fitnessAnalysis.nutrition.meals.snacks && fitnessAnalysis.nutrition.meals.snacks.map((snack: any, index: number) => (
                            <div key={index} className="bg-white rounded p-2 border border-gray-200">
                              <div className="flex justify-between items-center mb-1">
                                <h5 className="font-medium text-xs" style={{ color: '#000000' }}>
                                  {snack.name}
                                </h5>
                                <span className="text-xs text-gray-600">
                                  {snack.calories} cal
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 mb-1">
                                P: {snack.protein}g | C: {snack.carbs}g | F: {snack.fats}g
                              </div>
                              <div className="text-xs text-blue-600">
                                📍 {snack.location}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-2 text-gray-500">
                          <p className="text-xs">Loading meal recommendations...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading nutrition recommendations...</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}