import mongoose from "mongoose";

// Export models
export { UserModel } from "./models/User";
export { WorkflowModel } from "./models/Workflow";
export { NodeModel } from "./models/Node";
export { ExecutionModel } from "./models/Execution";

// Export mongoose types (for backend)
export type { IUser } from "./models/User";
export type { IWorkflow, IWorkflowNode, IWorkflowEdge } from "./models/Workflow";
export type { INode, ICredentialField } from "./models/Node";
export type { IExecution, ExecutionStatus } from "./models/Execution";

// Export shared types (for frontend/backend)
export * from "./types";

// Database connection
export async function connectDB(url: string) {
  try {
    await mongoose.connect(url);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
}
