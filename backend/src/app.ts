import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import shiftRoutes from "./modules/shifts/shifts.routes";
import swapRoutes from "./modules/swaps/swaps.routes";
import notificationRoutes from "./modules/notifications/notifications.routes";
import auditRoutes from "./modules/audit/audit.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://mandarjoshii.github.io",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

// Routes
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);

// Error handler — must be registered last
app.use(errorHandler);

export default app;