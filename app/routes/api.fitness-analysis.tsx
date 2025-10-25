import { readFile } from "fs/promises";
import { join } from "path";

export async function action({ request }: { request: Request }) {
  try {
    // Read the user data
    const userDataDir = join(process.cwd(), 'user-data');
    const userDataPath = join(userDataDir, 'user-data.json');
    
    let userData;
    try {
      const userDataContent = await readFile(userDataPath, 'utf8');
      userData = JSON.parse(userDataContent);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'No user data found. Please complete the form and camera analysis first.' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create the Gemini API prompt
    const prompt = `You are FitAI, a specialized fitness and nutrition AI. Analyze the following user data and provide a comprehensive fitness analysis in JSON format.

USER DATA:
${JSON.stringify(userData, null, 2)}

Please provide a detailed analysis in the following JSON format:

{
  "bmi": {
    "value": 22.5,
    "category": "Normal weight",
    "description": "Your BMI indicates a healthy weight range"
  },
  "bodyFatPercentage": {
    "value": 18.5,
    "category": "Athletic",
    "description": "Your body fat percentage suggests good muscle definition"
  },
  "muscleMass": {
    "value": 45.2,
    "unit": "kg",
    "description": "Your muscle mass is well-developed for your frame"
  },
  "fitnessScore": {
    "value": 78,
    "max": 100,
    "category": "Good",
    "description": "You have a solid fitness foundation with room for improvement"
  },
  "areasToFocus": [
    "chest",
    "shoulders",
    "core"
  ],
  "workoutPlan": {
    "monday": {
      "focus": "Upper Body Strength",
      "exercises": [
        {
          "name": "Bench Press",
          "sets": 4,
          "reps": "8-10",
          "rest": "2-3 minutes"
        },
        {
          "name": "Pull-ups",
          "sets": 3,
          "reps": "6-8",
          "rest": "2 minutes"
        }
      ]
    },
    "tuesday": {
      "focus": "Lower Body Power",
      "exercises": [
        {
          "name": "Squats",
          "sets": 4,
          "reps": "10-12",
          "rest": "2-3 minutes"
        },
        {
          "name": "Deadlifts",
          "sets": 3,
          "reps": "6-8",
          "rest": "3 minutes"
        }
      ]
    },
    "wednesday": {
      "focus": "Rest Day",
      "exercises": [
        {
          "name": "Light stretching or yoga",
          "sets": 1,
          "reps": "20-30 minutes",
          "rest": "N/A"
        }
      ]
    },
    "thursday": {
      "focus": "Push Day",
      "exercises": [
        {
          "name": "Overhead Press",
          "sets": 4,
          "reps": "8-10",
          "rest": "2-3 minutes"
        },
        {
          "name": "Dips",
          "sets": 3,
          "reps": "8-12",
          "rest": "2 minutes"
        }
      ]
    },
    "friday": {
      "focus": "Pull Day",
      "exercises": [
        {
          "name": "Bent-over Rows",
          "sets": 4,
          "reps": "8-10",
          "rest": "2-3 minutes"
        },
        {
          "name": "Lat Pulldowns",
          "sets": 3,
          "reps": "10-12",
          "rest": "2 minutes"
        }
      ]
    },
    "saturday": {
      "focus": "Legs & Core",
      "exercises": [
        {
          "name": "Lunges",
          "sets": 3,
          "reps": "12 each leg",
          "rest": "2 minutes"
        },
        {
          "name": "Plank",
          "sets": 3,
          "reps": "45-60 seconds",
          "rest": "1 minute"
        }
      ]
    },
    "sunday": {
      "focus": "Active Recovery",
      "exercises": [
        {
          "name": "Light cardio or walking",
          "sets": 1,
          "reps": "30-45 minutes",
          "rest": "N/A"
        }
      ]
    }
  },
  "gymLocation": {
    "name": "Ohio State University Recreation Center",
    "address": "337 W 17th Ave, Columbus, OH 43210",
    "hours": "6:00 AM - 11:00 PM (Mon-Fri), 8:00 AM - 10:00 PM (Weekends)",
    "features": ["Full weight room", "Cardio equipment", "Group fitness classes", "Indoor track", "Basketball courts"],
    "recommendedTimes": ["Early morning (6-8 AM)", "Late evening (8-10 PM)"]
  },
  "nutrition": {
    "dailyCalories": {
      "target": 2200,
      "description": "Based on your goals and activity level"
    },
    "macros": {
      "protein": {
        "grams": 165,
        "percentage": 30,
        "description": "Essential for muscle building and recovery"
      },
      "carbs": {
        "grams": 275,
        "percentage": 50,
        "description": "Primary energy source for workouts"
      },
      "fats": {
        "grams": 73,
        "percentage": 20,
        "description": "Important for hormone production and nutrient absorption"
      }
    },
    "meals": {
      "breakfast": {
        "name": "Protein Oatmeal",
        "calories": 450,
        "protein": 25,
        "carbs": 45,
        "fats": 12,
        "ingredients": ["1 cup oats", "1 scoop protein powder", "1 banana", "1 tbsp almond butter", "1 cup almond milk"]
      },
      "lunch": {
        "name": "Grilled Chicken Salad",
        "calories": 500,
        "protein": 35,
        "carbs": 30,
        "fats": 20,
        "ingredients": ["6oz grilled chicken breast", "Mixed greens", "1/2 avocado", "Cherry tomatoes", "Olive oil dressing"]
      },
      "dinner": {
        "name": "Salmon with Sweet Potato",
        "calories": 600,
        "protein": 40,
        "carbs": 50,
        "fats": 25,
        "ingredients": ["6oz salmon fillet", "1 large sweet potato", "Steamed broccoli", "1 tbsp olive oil"]
      },
      "snacks": [
        {
          "name": "Greek Yogurt with Berries",
          "calories": 200,
          "protein": 15,
          "carbs": 25,
          "fats": 5
        },
        {
          "name": "Protein Shake",
          "calories": 250,
          "protein": 25,
          "carbs": 15,
          "fats": 8
        }
      ]
    }
  }
}

IMPORTANT: 
- Calculate BMI using the formula: BMI = weight(kg) / height(m)²
- Estimate body fat percentage based on gender, age, and fitness level
- Consider the user's primary goal (weight-loss, muscle-gain, etc.)
- Provide realistic and achievable recommendations
- Use the camera results (muscle estimates, pose data) to inform your analysis
- Make the workout plan progressive and suitable for their fitness level
- Include specific exercises with proper sets and reps
- Provide detailed nutrition information with actual food recommendations
- All values should be realistic and based on the user's actual data`;

    // Calculate BMI and other metrics from user data
    const heightCm = parseFloat(userData.height);
    const weightKg = parseFloat(userData.weight);
    
    // Convert to imperial units
    const heightInches = heightCm / 2.54;
    const weightLbs = weightKg * 2.20462;
    
    // Calculate BMI using metric (standard formula)
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    // Determine BMI category with encouraging language
    let bmiCategory = "Healthy weight range";
    if (bmi < 18.5) bmiCategory = "Building up strength";
    else if (bmi >= 25 && bmi < 30) bmiCategory = "Working towards optimal health";
    else if (bmi >= 30) bmiCategory = "Ready for transformation";
    
    // Estimate body fat percentage based on BMI and gender
    let estimatedBodyFat = 15; // Default for athletic male
    if (userData.gender === 'male') {
      if (bmi < 20) estimatedBodyFat = 8;
      else if (bmi < 25) estimatedBodyFat = 12;
      else if (bmi < 30) estimatedBodyFat = 18;
      else estimatedBodyFat = 25;
    } else {
      if (bmi < 20) estimatedBodyFat = 15;
      else if (bmi < 25) estimatedBodyFat = 20;
      else if (bmi < 30) estimatedBodyFat = 28;
      else estimatedBodyFat = 35;
    }
    
    // Calculate muscle mass estimate
    const muscleMassKg = weightKg * 0.4; // Rough estimate: 40% of body weight
    const muscleMassLbs = muscleMassKg * 2.20462; // Convert to pounds
    
    // Determine fitness score based on BMI and goals
    let fitnessScore = 70; // Base score
    if (bmi >= 18.5 && bmi < 25) fitnessScore += 15;
    if (userData.fitnessLevel === 'advanced') fitnessScore += 10;
    else if (userData.fitnessLevel === 'intermediate') fitnessScore += 5;
    
    const analysis = {
      bmi: {
        value: bmi.toFixed(1),
        category: bmiCategory,
        description: `Your BMI of ${bmi.toFixed(1)} shows you're ${bmiCategory.toLowerCase()}, and we're excited to help you reach your goals!`
      },
      measurements: {
        height: {
          cm: heightCm.toFixed(0),
          inches: heightInches.toFixed(0),
          display: `${Math.floor(heightInches / 12)}'${Math.round(heightInches % 12)}"`
        },
        weight: {
          kg: weightKg.toFixed(1),
          lbs: weightLbs.toFixed(1),
          display: `${weightLbs.toFixed(1)} lbs`
        }
      },
      bodyFatPercentage: {
        value: estimatedBodyFat.toFixed(1),
        category: estimatedBodyFat < 10 ? "Elite Level" : estimatedBodyFat < 15 ? "Athletic" : estimatedBodyFat < 20 ? "Great Shape" : "Ready to Transform",
        description: `Your estimated body fat percentage of ${estimatedBodyFat.toFixed(1)}% shows ${estimatedBodyFat < 15 ? 'excellent muscle definition' : 'great potential for building lean muscle'}`
      },
      muscleMass: {
        value: muscleMassLbs.toFixed(1),
        unit: "lbs",
        description: `Your estimated muscle mass of ${muscleMassLbs.toFixed(1)} lbs provides a ${muscleMassKg > 50 ? 'strong' : 'solid'} foundation for building even more strength`
      },
      fitnessScore: {
        value: fitnessScore,
        max: 100,
        category: fitnessScore >= 90 ? "Outstanding" : fitnessScore >= 80 ? "Excellent" : fitnessScore >= 70 ? "Great Potential" : "Ready to Grow",
        description: `You have a ${fitnessScore >= 80 ? 'strong' : 'solid'} fitness foundation with ${fitnessScore >= 80 ? 'amazing' : 'great'} potential for growth`
      },
      areasToFocus: (() => {
        const areas = [];
        if (userData.primaryGoal === 'muscle-gain') {
          areas.push('chest', 'back', 'legs');
        } else if (userData.primaryGoal === 'weight-loss') {
          areas.push('core', 'cardio', 'full-body');
        } else {
          areas.push('strength', 'endurance', 'flexibility');
        }
        
        // Add areas based on camera results if available
        if (userData.cameraResults?.muscleEstimates) {
          const muscleData = userData.cameraResults.muscleEstimates;
          if (muscleData.chest < 30) areas.push('chest');
          if (muscleData.shoulders < 50) areas.push('shoulders');
          if (muscleData.legs < 50) areas.push('legs');
        }
        
        return [...new Set(areas)]; // Remove duplicates
      })(),
      workoutPlan: (() => {
        // Create personalized workout plan based on user goals and fitness level
        const isMuscleGain = userData.primaryGoal === 'muscle-gain';
        const isWeightLoss = userData.primaryGoal === 'weight-loss';
        const isBeginner = userData.fitnessLevel === 'beginner';
        const isAdvanced = userData.fitnessLevel === 'advanced';
        
        // Adjust sets and reps based on fitness level
        const sets = isBeginner ? 3 : isAdvanced ? 4 : 3;
        const reps = isBeginner ? "8-12" : isAdvanced ? "6-10" : "8-10";
        const rest = isBeginner ? "1-2 minutes" : isAdvanced ? "2-3 minutes" : "2 minutes";
        
        // Focus areas based on goals and camera results
        const focusAreas = [];
        if (isMuscleGain) {
          focusAreas.push('chest', 'back', 'legs', 'shoulders');
        } else if (isWeightLoss) {
          focusAreas.push('full-body', 'cardio', 'core');
        } else {
          focusAreas.push('strength', 'endurance', 'flexibility');
        }
        
        // Add specific areas from camera analysis
        if (userData.cameraResults?.muscleEstimates) {
          const muscleData = userData.cameraResults.muscleEstimates;
          if (muscleData.chest < 30) focusAreas.push('chest');
          if (muscleData.shoulders < 50) focusAreas.push('shoulders');
          if (muscleData.legs < 50) focusAreas.push('legs');
        }
        
        return {
          monday: {
            focus: isMuscleGain ? "Upper Body Strength" : isWeightLoss ? "Full Body HIIT" : "Push Day",
            exercises: isMuscleGain ? [
              {
                name: "Bench Press",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Pull-ups",
                sets: sets - 1,
                reps: isBeginner ? "3-5" : "6-8",
                rest: rest
              },
              {
                name: "Overhead Press",
                sets: sets - 1,
                reps: reps,
                rest: rest
              }
            ] : isWeightLoss ? [
              {
                name: "Burpees",
                sets: 4,
                reps: "10-15",
                rest: "1 minute"
              },
              {
                name: "Mountain Climbers",
                sets: 3,
                reps: "30 seconds",
                rest: "30 seconds"
              },
              {
                name: "Jump Squats",
                sets: 3,
                reps: "15-20",
                rest: "1 minute"
              }
            ] : [
              {
                name: "Push-ups",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Dips",
                sets: sets - 1,
                reps: reps,
                rest: rest
              },
              {
                name: "Overhead Press",
                sets: sets - 1,
                reps: reps,
                rest: rest
              }
            ]
          },
          tuesday: {
            focus: isMuscleGain ? "Lower Body Power" : isWeightLoss ? "Cardio & Core" : "Pull Day",
            exercises: isMuscleGain ? [
              {
                name: "Squats",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Deadlifts",
                sets: sets - 1,
                reps: isBeginner ? "5-8" : "6-8",
                rest: "3 minutes"
              },
              {
                name: "Lunges",
                sets: sets - 1,
                reps: "12 each leg",
                rest: rest
              }
            ] : isWeightLoss ? [
              {
                name: "Treadmill/Stationary Bike",
                sets: 1,
                reps: "20-30 minutes",
                rest: "N/A"
              },
              {
                name: "Plank",
                sets: 3,
                reps: "45-60 seconds",
                rest: "1 minute"
              },
              {
                name: "Russian Twists",
                sets: 3,
                reps: "20 each side",
                rest: "30 seconds"
              }
            ] : [
              {
                name: "Pull-ups",
                sets: sets,
                reps: isBeginner ? "3-5" : "6-8",
                rest: rest
              },
              {
                name: "Bent-over Rows",
                sets: sets - 1,
                reps: reps,
                rest: rest
              },
              {
                name: "Lat Pulldowns",
                sets: sets - 1,
                reps: reps,
                rest: rest
              }
            ]
          },
          wednesday: {
            focus: "Rest Day",
            exercises: [
              {
                name: "Light stretching or yoga",
                sets: 1,
                reps: "20-30 minutes",
                rest: "N/A"
              }
            ]
          },
          thursday: {
            focus: isMuscleGain ? "Push Day" : isWeightLoss ? "Strength Training" : "Legs & Core",
            exercises: isMuscleGain ? [
              {
                name: "Incline Dumbbell Press",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Dips",
                sets: sets - 1,
                reps: reps,
                rest: rest
              },
              {
                name: "Tricep Extensions",
                sets: sets - 1,
                reps: "10-12",
                rest: "1-2 minutes"
              }
            ] : isWeightLoss ? [
              {
                name: "Goblet Squats",
                sets: 3,
                reps: "12-15",
                rest: "1 minute"
              },
              {
                name: "Dumbbell Rows",
                sets: 3,
                reps: "10-12",
                rest: "1 minute"
              },
              {
                name: "Push-ups",
                sets: 3,
                reps: "8-12",
                rest: "1 minute"
              }
            ] : [
              {
                name: "Squats",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Lunges",
                sets: sets - 1,
                reps: "12 each leg",
                rest: rest
              },
              {
                name: "Plank",
                sets: 3,
                reps: "45-60 seconds",
                rest: "1 minute"
              }
            ]
          },
          friday: {
            focus: isMuscleGain ? "Pull Day" : isWeightLoss ? "HIIT Cardio" : "Upper Body",
            exercises: isMuscleGain ? [
              {
                name: "Bent-over Rows",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Lat Pulldowns",
                sets: sets - 1,
                reps: reps,
                rest: rest
              },
              {
                name: "Bicep Curls",
                sets: sets - 1,
                reps: "12-15",
                rest: "1-2 minutes"
              }
            ] : isWeightLoss ? [
              {
                name: "High Knees",
                sets: 4,
                reps: "30 seconds",
                rest: "30 seconds"
              },
              {
                name: "Jumping Jacks",
                sets: 3,
                reps: "45 seconds",
                rest: "15 seconds"
              },
              {
                name: "Burpees",
                sets: 3,
                reps: "8-12",
                rest: "1 minute"
              }
            ] : [
              {
                name: "Bench Press",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Pull-ups",
                sets: sets - 1,
                reps: isBeginner ? "3-5" : "6-8",
                rest: rest
              },
              {
                name: "Overhead Press",
                sets: sets - 1,
                reps: reps,
                rest: rest
              }
            ]
          },
          saturday: {
            focus: isMuscleGain ? "Legs & Core" : isWeightLoss ? "Active Recovery" : "Full Body",
            exercises: isMuscleGain ? [
              {
                name: "Front Squats",
                sets: sets - 1,
                reps: reps,
                rest: rest
              },
              {
                name: "Romanian Deadlifts",
                sets: sets - 1,
                reps: "10-12",
                rest: rest
              },
              {
                name: "Plank",
                sets: 3,
                reps: "45-60 seconds",
                rest: "1 minute"
              }
            ] : isWeightLoss ? [
              {
                name: "Walking or light jogging",
                sets: 1,
                reps: "30-45 minutes",
                rest: "N/A"
              },
              {
                name: "Yoga or stretching",
                sets: 1,
                reps: "20-30 minutes",
                rest: "N/A"
              }
            ] : [
              {
                name: "Deadlifts",
                sets: sets,
                reps: reps,
                rest: rest
              },
              {
                name: "Squats",
                sets: sets - 1,
                reps: reps,
                rest: rest
              },
              {
                name: "Push-ups",
                sets: sets - 1,
                reps: reps,
                rest: rest
              }
            ]
          },
          sunday: {
            focus: "Active Recovery",
            exercises: [
              {
                name: "Light cardio or walking",
                sets: 1,
                reps: "30-45 minutes",
                rest: "N/A"
              }
            ]
          }
        };
      })(),
      gymLocation: {
        name: "Ohio State University Recreation Center",
        address: "337 W 17th Ave, Columbus, OH 43210",
        hours: "6:00 AM - 11:00 PM (Mon-Fri), 8:00 AM - 10:00 PM (Weekends)",
        features: ["Full weight room", "Cardio equipment", "Group fitness classes", "Indoor track", "Basketball courts"],
        recommendedTimes: ["Early morning (6-8 AM)", "Late evening (8-10 PM)"]
      },
      nutrition: {
        dailyCalories: {
          target: (() => {
            // Calculate BMR using Mifflin-St Jeor Equation
            let bmr;
            if (userData.gender === 'male') {
              bmr = 10 * weightKg + 6.25 * parseFloat(userData.height) - 5 * parseFloat(userData.age) + 5;
            } else {
              bmr = 10 * weightKg + 6.25 * parseFloat(userData.height) - 5 * parseFloat(userData.age) - 161;
            }
            
            // Apply activity multiplier
            let activityMultiplier = 1.2; // Sedentary
            if (userData.fitnessLevel === 'beginner') activityMultiplier = 1.375;
            else if (userData.fitnessLevel === 'intermediate') activityMultiplier = 1.55;
            else if (userData.fitnessLevel === 'advanced') activityMultiplier = 1.725;
            
            let tdee = bmr * activityMultiplier;
            
            // Adjust based on goal
            if (userData.primaryGoal === 'muscle-gain') tdee += 300; // Surplus for muscle gain
            else if (userData.primaryGoal === 'weight-loss') tdee -= 500; // Deficit for weight loss
            
            return Math.round(tdee);
          })(),
          description: `Based on your ${userData.primaryGoal.replace('-', ' ')} goals and ${userData.fitnessLevel} activity level`
        },
        macros: (() => {
          const dailyCalories = (() => {
            let bmr;
            if (userData.gender === 'male') {
              bmr = 10 * weightKg + 6.25 * parseFloat(userData.height) - 5 * parseFloat(userData.age) + 5;
            } else {
              bmr = 10 * weightKg + 6.25 * parseFloat(userData.height) - 5 * parseFloat(userData.age) - 161;
            }
            
            let activityMultiplier = 1.2;
            if (userData.fitnessLevel === 'beginner') activityMultiplier = 1.375;
            else if (userData.fitnessLevel === 'intermediate') activityMultiplier = 1.55;
            else if (userData.fitnessLevel === 'advanced') activityMultiplier = 1.725;
            
            let tdee = bmr * activityMultiplier;
            if (userData.primaryGoal === 'muscle-gain') tdee += 300;
            else if (userData.primaryGoal === 'weight-loss') tdee -= 500;
            
            return Math.round(tdee);
          })();
          
          // Calculate macros based on goal (using weight in kg for standard calculations)
          let proteinGrams, carbGrams, fatGrams;
          if (userData.primaryGoal === 'muscle-gain') {
            proteinGrams = Math.round(weightKg * 2.2); // 2.2g per kg for muscle gain
            carbGrams = Math.round((dailyCalories * 0.45) / 4); // 45% carbs
            fatGrams = Math.round((dailyCalories * 0.25) / 9); // 25% fats
          } else if (userData.primaryGoal === 'weight-loss') {
            proteinGrams = Math.round(weightKg * 2.0); // 2.0g per kg for weight loss
            carbGrams = Math.round((dailyCalories * 0.35) / 4); // 35% carbs
            fatGrams = Math.round((dailyCalories * 0.30) / 9); // 30% fats
          } else {
            proteinGrams = Math.round(weightKg * 1.6); // 1.6g per kg for maintenance
            carbGrams = Math.round((dailyCalories * 0.50) / 4); // 50% carbs
            fatGrams = Math.round((dailyCalories * 0.20) / 9); // 20% fats
          }
          
          return {
            protein: {
              grams: proteinGrams,
              percentage: Math.round((proteinGrams * 4 / dailyCalories) * 100),
              description: "Essential for muscle building and recovery"
            },
            carbs: {
              grams: carbGrams,
              percentage: Math.round((carbGrams * 4 / dailyCalories) * 100),
              description: "Primary energy source for workouts"
            },
            fats: {
              grams: fatGrams,
              percentage: Math.round((fatGrams * 9 / dailyCalories) * 100),
              description: "Important for hormone production and nutrient absorption"
            }
          };
        })(),
        meals: {
          breakfast: {
            name: "Protein Oatmeal",
            calories: 520,
            protein: 30,
            carbs: 55,
            fats: 15,
            ingredients: ["1 cup oats", "1 scoop protein powder", "1 banana", "1 tbsp almond butter", "1 cup almond milk"]
          },
          lunch: {
            name: "Grilled Chicken Salad",
            calories: 580,
            protein: 45,
            carbs: 35,
            fats: 25,
            ingredients: ["8oz grilled chicken breast", "Mixed greens", "1/2 avocado", "Cherry tomatoes", "Olive oil dressing"]
          },
          dinner: {
            name: "Salmon with Sweet Potato",
            calories: 650,
            protein: 50,
            carbs: 60,
            fats: 30,
            ingredients: ["8oz salmon fillet", "1 large sweet potato", "Steamed broccoli", "1 tbsp olive oil"]
          },
          snacks: [
            {
              name: "Greek Yogurt with Berries",
              calories: 250,
              protein: 20,
              carbs: 30,
              fats: 8
            },
            {
              name: "Protein Shake",
              calories: 300,
              protein: 30,
              carbs: 20,
              fats: 10
            }
          ]
        }
      }
    };

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          ...analysis,
          userData: userData // Include userData in analysis object for easy access
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error generating fitness analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate fitness analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
