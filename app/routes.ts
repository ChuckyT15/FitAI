import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/intro.tsx"),
  route("home", "routes/home.tsx"),
  route("camera", "routes/camera.jsx"),
  route("analytics", "routes/analytics.tsx"),
  route("api/save-form-data", "routes/api.save-form-data.tsx"),
  route("api/update-form-with-camera", "routes/api.update-form-with-camera.tsx"),
  route("api/fitness-analysis", "routes/api.fitness-analysis.tsx")
] satisfies RouteConfig;
