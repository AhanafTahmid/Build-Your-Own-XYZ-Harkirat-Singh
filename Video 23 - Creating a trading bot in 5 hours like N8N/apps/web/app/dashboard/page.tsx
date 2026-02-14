"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import type { WorkflowListItem } from "../types/workflow";

export default function Dashboard() {
  const [workflows] = useState<WorkflowListItem[]>([
    {
      id: "691a483e0360d75ed6819342",
      name: "Workflow 691a483e0360d75ed6819342",
      nodes: 2,
      edges: 1,
      createdAt: "2024-01-15",
    },
    {
      id: "691a48c00360d75ed6819350",
      name: "Workflow 691a48c00360d75ed6819350",
      nodes: 2,
      edges: 1,
      createdAt: "2024-01-16",
    },
    {
      id: "691a49318c1b0f67ccdec9d2",
      name: "Workflow 691a49318c1b0f67ccdec9d2",
      nodes: 2,
      edges: 1,
      createdAt: "2024-01-17",
    },
    {
      id: "691a499b8c1b0f67ccdec9f1",
      name: "Workflow 691a499b8c1b0f67ccdec9f1",
      nodes: 3,
      edges: 2,
      createdAt: "2024-01-18",
    },
    {
      id: "691a5cea8c1b0f67ccdeca05",
      name: "Workflow 691a5cea8c1b0f67ccdeca05",
      nodes: 2,
      edges: 1,
      createdAt: "2024-01-19",
    },
    {
      id: "691a5d218c1b0f67ccdeca13",
      name: "Workflow 691a5d218c1b0f67ccdeca13",
      nodes: 2,
      edges: 1,
      createdAt: "2024-01-20",
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Workflows</h1>
        <button className={styles.createButton}>Create new</button>
      </div>

      <div className={styles.workflowList}>
        {workflows.map((workflow) => (
          <div key={workflow.id} className={styles.workflowCard}>
            <div className={styles.workflowInfo}>
              <h3 className={styles.workflowName}>{workflow.name}</h3>
              <p className={styles.workflowMeta}>
                {workflow.nodes} nodes • {workflow.edges} edges
              </p>
            </div>
            <div className={styles.workflowActions}>
              <Link
                href={`/dashboard/workflow-flow/${workflow.id}`}
                className={styles.actionButton}
              >
                Open
              </Link>
              <Link
                href={`/dashboard/workflow/${workflow.id}/executions`}
                className={styles.actionButton}
              >
                Executions
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}