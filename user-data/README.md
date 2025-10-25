# User Data Folder

This folder contains user data from the FitAI application. Only one user profile is maintained at a time.

## File Format

User data is stored in a single JSON file:
- `user-data.json` - Contains the current user's form data and camera analysis results

## Data Structure

The user-data.json file contains:
- User form data (height, weight, age, gender, fitness level, primary goal)
- Timestamp of form submission
- Unique form ID
- Camera analysis results (added after camera analysis)

## Example

```json
{
  "height": "175",
  "weight": "70",
  "age": "25",
  "gender": "male",
  "fitnessLevel": "intermediate",
  "primaryGoal": "muscle-gain",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "id": "form-1705312200000",
  "cameraResults": {
    "method": "auto_hold",
    "scaleCmPerPixel": 0.1,
    "knownHeightCm": 175,
    "timestamp": "2024-01-15T10:35:00.000Z",
    "poseSummary": {
      "nose": { "x": 100, "y": 50, "score": 0.9 },
      "leftAnkle": { "x": 120, "y": 200, "score": 0.8 },
      "rightAnkle": { "x": 80, "y": 200, "score": 0.8 },
      "leftShoulder": { "x": 90, "y": 80, "score": 0.9 },
      "rightShoulder": { "x": 110, "y": 80, "score": 0.9 },
      "leftHip": { "x": 95, "y": 140, "score": 0.8 },
      "rightHip": { "x": 105, "y": 140, "score": 0.8 }
    },
    "muscleEstimates": {
      "shoulders": 75,
      "biceps": 60,
      "triceps": 55,
      "chest": 70,
      "back": 65,
      "legs": 80
    },
    "analysisTimestamp": "2024-01-15T10:35:00.000Z"
  }
}
```

## Access

The user-data.json file can be easily accessed programmatically or manually for:
- User analytics
- Personalized recommendations
- Data export
- Backup purposes

## File Management

- **Form submission**: Creates or overwrites user-data.json with new form data
- **Camera analysis**: Updates the existing user-data.json with camera results
- **New form submission**: Replaces the entire user-data.json with fresh form data
