import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/intro.tsx"),
  route("home", "routes/home.tsx"),
  route("form", "routes/form.tsx"),
  route("camera", "routes/camera.tsx"),
  route("analytics", "routes/analytics.tsx")
] satisfies RouteConfig;
