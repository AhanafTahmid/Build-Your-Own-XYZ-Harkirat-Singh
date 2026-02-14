"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./executions.module.css";
import type { Execution } from "../../../../types/workflow";

export default function ExecutionsPage({
  params,
}: {
  params: { id: string };
}) {
  const [executions] = useState<Execution[]>([
    {
      id: "exec-1",
      workflowId: params.id,
      status: "SUCCESS",
      startTime: "2024-02-14 10:30:00",
      duration: "2.3s",
      mode: "automatic",
    },
    {
      id: "exec-2",
      workflowId: params.id,
      status: "SUCCESS",
      startTime: "2024-02-14 10:29:00",
      duration: "1.8s",
      mode: "automatic",
    },
    {
      id: "exec-3",
      workflowId: params.id,
      status: "ERROR",
      startTime: "2024-02-14 10:28:00",
      duration: "0.5s",
      mode: "automatic",
    },
    {
      id: "exec-4",
      workflowId: params.id,
      status: "SUCCESS",
      startTime: "2024-02-14 10:27:00",
      duration: "2.1s",
      mode: "automatic",
    },
  ]);

  const getStatusColor = (status: Execution["status"]) => {
    switch (status) {
      case "SUCCESS":
        return "#10b981";
      case "ERROR":
        return "#ef4444";
      case "RUNNING":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Workflow Executions</h1>
          <p className={styles.workflowId}>Workflow ID: {params.id}</p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href={`/dashboard/workflow/${params.id}`}
            className={styles.button}
          >
            Back to workflow
          </Link>
          <Link href="/dashboard" className={styles.button}>
            Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.executionList}>
          {executions.map((execution) => (
            <div key={execution.id} className={styles.executionCard}>
              <div className={styles.statusIndicator}>
                <div
                  className={styles.statusDot}
                  style={{ background: getStatusColor(execution.status) }}
                />
                <span className={styles.statusText}>
                  {execution.status.toUpperCase()}
                </span>
              </div>

              <div className={styles.executionInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Started at:</span>
                  <span className={styles.value}>{execution.startTime}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Duration:</span>
                  <span className={styles.value}>{execution.duration}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Mode:</span>
                  <span className={styles.value}>{execution.mode}</span>
                </div>
              </div>

              <button className={styles.viewButton}>View details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
