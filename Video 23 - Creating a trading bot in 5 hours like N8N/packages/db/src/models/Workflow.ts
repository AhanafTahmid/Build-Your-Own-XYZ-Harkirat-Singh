import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWorkflowNode {
  type: Types.ObjectId; // Reference to Node
  data: {
    kind: "ACTION" | "TRIGGER";
    metadata: any; // Flexible metadata for different node types
  };
  id: string;
  position: {
    x: number;
    y: number;
  };
  credentials?: any; // User's specific credentials for this node instance
}

export interface IWorkflowEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
}

export interface IWorkflow extends Document {
  _id: string;
  userId: Types.ObjectId;
  name?: string;
  nodes: IWorkflowNode[];
  edges: IWorkflowEdge[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowNodeSchema = new Schema(
  {
    type: {
      type: mongoose.Types.ObjectId,
      ref: "Node",
      required: true,
    },
    data: {
      kind: {
        type: String,
        enum: ["ACTION", "TRIGGER"],
        required: true,
      },
      metadata: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
    id: {
      type: String,
      required: true,
    },
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    credentials: {
      type: Schema.Types.Mixed,
    },
  },
  { _id: false }
);

const WorkflowEdgeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const WorkflowSchema = new Schema<IWorkflow>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    nodes: [WorkflowNodeSchema],
    edges: [WorkflowEdgeSchema],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkflowModel = mongoose.model<IWorkflow>("Workflow", WorkflowSchema);
