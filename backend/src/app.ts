import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import shiftRoutes from "./modules/shifts/shifts.routes";
import swapRoutes from "./modules/swaps/swaps.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
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

// Error handler — must be registered last
app.use(errorHandler);

export default app;