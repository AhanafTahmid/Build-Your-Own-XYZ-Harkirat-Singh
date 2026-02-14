# @repo/db

Database models and schemas for the Trading Bot N8N-style application.

## Overview

This package contains MongoDB schemas using Mongoose for:
- Users
- Workflows
- Nodes (Node Templates)
- Executions

## Models

### User
```typescript
{
  _id: string;
  username: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### Node (Template)
```typescript
{
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
```

### Workflow
```typescript
{
  _id: string;
  userId: ObjectId; // Reference to User
  name?: string;
  nodes: Array<{
    type: ObjectId; // Reference to Node template
    data: {
      kind: "ACTION" | "TRIGGER";
      metadata: any; // Node-specific config (e.g., timer interval, trade params)
    };
    id: string; // Unique instance ID in the workflow
    position: { x: number; y: number };
    credentials?: any; // User's credentials for this node instance
  }>;
  edges: Array<{
    id: string;
    source: string; // Node instance ID
    target: string; // Node instance ID
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Execution
```typescript
{
  _id: string;
  workflowId: ObjectId; // Reference to Workflow
  status: "PENDING" | "RUNNING" | "SUCCESS" | "ERROR";
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
```

## Usage

### Installation

```bash
bun install
```

### Connection

```typescript
import { connectDB, disconnectDB } from "@repo/db";

await connectDB(process.env.MONGODB_URL);
```

### Using Models

```typescript
import { UserModel, WorkflowModel, NodeModel, ExecutionModel } from "@repo/db";

// Create a user
const user = await UserModel.create({
  username: "trader",
  password: hashedPassword,
});

// Create a workflow
const workflow = await WorkflowModel.create({
  userId: user._id,
  name: "SOL Trading Bot",
  nodes: [
    {
      type: timerNodeId,
      data: {
        kind: "TRIGGER",
        metadata: { interval: "60 seconds" },
      },
      id: "timer-1",
      position: { x: 200, y: 300 },
    },
    {
      type: tradeNodeId,
      data: {
        kind: "ACTION",
        metadata: {
          type: "LONG",
          quantity: 0.01,
          symbol: "SOL",
        },
      },
      id: "trade-1",
      position: { x: 600, y: 200 },
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "timer-1",
      target: "trade-1",
    },
  ],
});

// Create an execution
const execution = await ExecutionModel.create({
  workflowId: workflow._id,
  status: "PENDING",
  startTime: new Date(),
  mode: "automatic",
});
```

## Schema Design Principles

1. **Separation of Concerns**: Node templates (NodeModel) are separate from workflow node instances
2. **Flexibility**: Metadata field allows different node types to store custom configuration
3. **Relationships**: Proper references between Users, Workflows, Nodes, and Executions
4. **Execution Tracking**: Comprehensive execution logs with status tracking
5. **Indexing**: Optimized for common queries (e.g., executions by workflow)

## Building

```bash
bun run build
```

This will compile TypeScript files to the `dist` directory.
