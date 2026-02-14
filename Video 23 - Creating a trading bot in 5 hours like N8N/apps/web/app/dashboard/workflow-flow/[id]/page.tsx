"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Link from "next/link";
import styles from "./workflow-flow.module.css";

// Custom Node Components
import TimerNode from "./nodes/TimerNode";
import TradeNode from "./nodes/TradeNode";

const nodeTypes = {
  timer: TimerNode,
  trade: TradeNode,
};

const initialNodes = [
  {
    id: "timer-1",
    type: "timer",
    position: { x: 200, y: 300 },
    data: {
      label: "Timer",
      interval: "60 seconds",
    },
  },
  {
    id: "trade-1",
    type: "trade",
    position: { x: 600, y: 200 },
    data: {
      label: "Lighter Trade",
      type: "LONG",
      quantity: 0.01,
      symbol: "SOL",
    },
  },
];

const initialEdges = [
  {
    id: "edge-1",
    source: "timer-1",
    target: "trade-1",
    animated: true,
    style: { stroke: "#666", strokeWidth: 2 },
  },
];

export default function WorkflowFlowPage({
  params,
}: {
  params: { id: string };
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Workflow</h1>
          <p className={styles.workflowId}>ID: {params.id}</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.button}>View executions</button>
          <Link href="/dashboard" className={styles.button}>
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className={styles.canvasWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className={styles.reactFlow}
        >
          <Controls className={styles.controls} />
          <MiniMap className={styles.minimap} />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
