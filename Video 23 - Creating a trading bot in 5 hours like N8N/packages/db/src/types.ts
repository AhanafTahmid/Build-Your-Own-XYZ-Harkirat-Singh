// Shared types that can be used in frontend without mongoose dependency

export type NodeType = "ACTION" | "TRIGGER";
export type ExecutionStatus = "PENDING" | "RUNNING" | "SUCCESS" | "ERROR";
export type ExecutionMode = "automatic" | "manual";
export type LogLevel = "info" | "error" | "warning";

export interface CredentialField {
  title: string;
  type: "string" | "number" | "boolean" | "password";
  required: boolean;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface NodeTemplate {
  id: string;
  title: string;
  description: string;
  type: NodeType;
  credentialsType?: CredentialField[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNode {
  type: string; // Node template ID
  data: {
    kind: NodeType;
    metadata: any;
  };
  id: string;
  position: {
    x: number;
    y: number;
  };
  credentials?: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
  id: string;
  userId: string;
  name?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionLog {
  nodeId: string;
  message: string;
  timestamp: string;
  level: LogLevel;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startTime: string;
  endTime?: string;
  logs?: ExecutionLog[];
  error?: string;
  mode: ExecutionMode;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface CreateWorkflowRequest {
  name?: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  isActive?: boolean;
}

export interface WorkflowListResponse {
  workflows: Array<{
    id: string;
    name?: string;
    nodes: number;
    edges: number;
    isActive: boolean;
    createdAt: string;
  }>;
}

export interface ExecutionListResponse {
  executions: Array<{
    id: string;
    status: ExecutionStatus;
    startTime: string;
    endTime?: string;
    duration?: string;
    mode: ExecutionMode;
  }>;
}
