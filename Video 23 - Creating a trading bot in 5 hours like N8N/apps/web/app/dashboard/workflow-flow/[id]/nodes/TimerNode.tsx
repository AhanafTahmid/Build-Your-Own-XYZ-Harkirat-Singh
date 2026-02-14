import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import styles from "./TimerNode.module.css";

function TimerNode({ data }: NodeProps) {
  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      
      <div className={styles.header}>
        <span className={styles.icon}>⏱️</span>
        <span className={styles.title}>{data.label || "Timer"}</span>
      </div>
      
      <div className={styles.content}>
        <p className={styles.label}>Every</p>
        <p className={styles.value}>{data.interval || "60 seconds"}</p>
      </div>
      
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}

export default memo(TimerNode);
