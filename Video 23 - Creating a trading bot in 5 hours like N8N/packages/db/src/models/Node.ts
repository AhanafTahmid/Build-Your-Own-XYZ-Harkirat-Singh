import mongoose, { Schema, Document } from "mongoose";

export interface ICredentialField {
  title: string;
  type: "string" | "number" | "boolean" | "password";
  required: boolean;
}

export interface INode extends Document {
  _id: string;
  title: string;
  description: string;
  type: "ACTION" | "TRIGGER";
  credentialsType?: Array<{
    title: string;
    type: "string" | "number" | "boolean" | "password";
    required: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CredentialFieldSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["string", "number", "boolean", "password"],
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const NodeSchema = new Schema<INode>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ACTION", "TRIGGER"],
      required: true,
    },
    credentialsType: [CredentialFieldSchema],
  },
  {
    timestamps: true,
  }
);

export const NodeModel = mongoose.model<INode>("Node", NodeSchema);
