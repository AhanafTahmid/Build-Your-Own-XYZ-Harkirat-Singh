// Frontend types matching the database schema

export type NodeType = "ACTION" | "TRIGGER";
export type ExecutionStatus = "PENDING" | "RUNNING" | "SUCCESS" | "ERROR";

export interface WorkflowNode {
  type: string; // Node template ID
  data: {
    kind: NodeType;
    metadata: Record<string, unknown>;
    label?: string; // For display purposes
  };
  id: string;
  position: {
    x: number;
    y: number;
  };
  credentials?: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
  id: string;
  userId?: string;
  name?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowListItem {
  id: string;
  name: string;
  nodes: number;
  edges: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startTime: string;
  endTime?: string;
  duration?: string;
  mode: "automatic" | "manual";
  error?: string;
}
