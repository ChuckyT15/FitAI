FitAI is a web app built to remove the fear of beginning at the gym — starting with students at The Ohio State University.

Using AI-powered body scanning (TensorFlow) and the Gemini API, FitAI creates a personalized workout and diet plan based on each user’s body type and goals. It also connects to a PostgreSQL database that includes Ohio State’s dining and gym information, making the plans relevant, convenient, and realistic for OSU students.

🚀 Why FitAI

Starting a fitness journey can be intimidating — especially for beginners who don’t know where to start, what workouts to do, or what to eat. FitAI makes that process easier by combining AI guidance, real data, and friendly interaction in one clean, intuitive app.

✨ Core Features

🧠 AI-powered personalization — Uses TensorFlow for body scanning and Gemini API for generating tailored workout and diet plans.

💬 Smart chatbot — Lets users ask fitness or nutrition questions and get instant, encouraging responses.

🏋️ OSU integration — Pulls data from Ohio State’s gym locations and dining options to suggest workouts and meals students can actually follow.

🎨 Clean React frontend — Modern, interactive, and mobile-friendly interface focused on comfort and confidence.

🗃️ PostgreSQL backend — Stores user data, fitness progress, and OSU facility info.

🧩 Tech Stack

Frontend: React + TailwindCSS

AI/ML: TensorFlow.js + Gemini API

Backend: Node.js / Express

Database: PostgreSQL (OSU-specific data)

🧭 Future Roadmap

FitAI’s long-term vision is to expand beyond Ohio State and bring the same personalized experience to colleges and cities nationwide — connecting local gyms, dining halls, and healthy spots everywhere.

Planned features include:

🌎 Expansion to multiple universities and cities

🍽️ Dynamic local meal recommendations

🎥 AI-powered form correction and progress tracking

🏆 Achievement system to motivate consistency

❤️ Our Mission

To make fitness accessible, personalized, and fear-free — helping students build habits that last long after college.

⚙️ How to Run Locally
1. Clone the repository
git clone https://github.com/yourusername/fitai.git
cd fitai

2. Install dependencies
npm install

3. Set up environment variables

Create a .env file in the project root with:

GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/fitai

4. Start the development server
npm run dev


Then open http://localhost:3000
 to view FitAI in your browser.

📈 In Summary

FitAI isn’t just another fitness app — it’s a confidence builder.
By blending AI, real campus data, and approachable design, it helps students take their first step toward lifelong health — one personalized plan at a time.
