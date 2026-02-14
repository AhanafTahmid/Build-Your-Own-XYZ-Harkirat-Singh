import mongoose, { Schema, Document, Types } from "mongoose";

export type ExecutionStatus = "PENDING" | "RUNNING" | "SUCCESS" | "ERROR";

export interface IExecution extends Document {
  _id: string;
  workflowId: Types.ObjectId;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  logs?: Array<{
    nodeId: string;
    message: string;
    timestamp: Date;
    level: "info" | "error" | "warning";
  }>;
  error?: string;
  mode: "automatic" | "manual";
  createdAt: Date;
  updatedAt: Date;
}

const ExecutionLogSchema = new Schema(
  {
    nodeId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    level: {
      type: String,
      enum: ["info", "error", "warning"],
      default: "info",
    },
  },
  { _id: false }
);

const ExecutionSchema = new Schema<IExecution>(
  {
    workflowId: {
      type: mongoose.Types.ObjectId,
      ref: "Workflow",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "RUNNING", "SUCCESS", "ERROR"],
      default: "PENDING",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endTime: {
      type: Date,
    },
    logs: [ExecutionLogSchema],
    error: {
      type: String,
    },
    mode: {
      type: String,
      enum: ["automatic", "manual"],
      default: "automatic",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
ExecutionSchema.index({ workflowId: 1, createdAt: -1 });

export const ExecutionModel = mongoose.model<IExecution>("Execution", ExecutionSchema);
