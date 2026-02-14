"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./workflow.module.css";
import type { WorkflowNode, WorkflowEdge } from "../../../types/workflow";

type DisplayNode = WorkflowNode & {
  data: {
    kind: "ACTION" | "TRIGGER";
    metadata: Record<string, unknown>;
    label: string;
    config?: {
      interval?: string;
      type?: string;
      quantity?: number;
      symbol?: string;
    };
  };
};

export default function WorkflowPage({
  params,
}: {
  params: { id: string };
}) {
  const [nodes] = useState<DisplayNode[]>([
    {
      id: "timer-1",
      type: "timer",
      position: { x: 200, y: 300 },
      data: {
        kind: "TRIGGER",
        label: "Timer",
        metadata: {},
        config: {
          interval: "60 seconds",
        },
      },
    },
    {
      id: "trade-1",
      type: "trade",
      position: { x: 600, y: 200 },
      data: {
        kind: "ACTION",
        label: "Lighter Trade",
        metadata: {},
        config: {
          type: "LONG",
          quantity: 0.01,
          symbol: "SOL",
        },
      },
    },
  ]);

  const [edges] = useState<WorkflowEdge[]>([
    {
      id: "edge-1",
      source: "timer-1",
      target: "trade-1",
    },
  ]);

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

      <div className={styles.canvas}>
        {/* Render nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={styles.node}
            style={{
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
            }}
          >
            <div className={styles.nodeHeader}>{node.data.label}</div>
            <div className={styles.nodeContent}>
              {node.type === "timer" && node.data.config?.interval && (
                <div className={styles.nodeInfo}>
                  <p className={styles.nodeLabel}>Every</p>
                  <p className={styles.nodeValue}>{node.data.config.interval}</p>
                </div>
              )}
              {node.type === "trade" && node.data.config && (
                <div className={styles.nodeInfo}>
                  <p className={styles.nodeParam}>
                    <span className={styles.paramLabel}>Type:</span>{" "}
                    <strong>{node.data.config.type}</strong>
                  </p>
                  <p className={styles.nodeParam}>
                    <span className={styles.paramLabel}>Qty:</span>{" "}
                    <strong>{node.data.config.quantity}</strong>
                  </p>
                  <p className={styles.nodeParam}>
                    <span className={styles.paramLabel}>Symbol:</span>{" "}
                    <strong>{node.data.config.symbol}</strong>
                  </p>
                </div>
              )}
            </div>
            {/* Connection points */}
            <div className={styles.connectionPoint} data-position="right" />
            <div className={styles.connectionPoint} data-position="left" />
          </div>
        ))}

        {/* Render edges */}
        <svg className={styles.edgesSvg}>
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            // Calculate connection points
            const startX = sourceNode.position.x + 240; // Node width + offset
            const startY = sourceNode.position.y + 80; // Half node height
            const endX = targetNode.position.x;
            const endY = targetNode.position.y + 80;

            // Create curved path
            const midX = (startX + endX) / 2;
            const path = `M ${startX} ${startY} Q ${midX} ${startY}, ${midX} ${(startY + endY) / 2} T ${endX} ${endY}`;

            return (
              <g key={edge.id}>
                <path
                  d={path}
                  stroke="#666"
                  strokeWidth="2"
                  fill="none"
                  className={styles.edge}
                />
                <circle cx={startX} cy={startY} r="4" fill="#666" />
                <circle cx={endX} cy={endY} r="4" fill="#666" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
