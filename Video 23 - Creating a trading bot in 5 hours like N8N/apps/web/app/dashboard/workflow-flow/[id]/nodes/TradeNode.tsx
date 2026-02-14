import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import styles from "./TradeNode.module.css";

function TradeNode({ data }: NodeProps) {
  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      
      <div className={styles.header}>
        <span className={styles.icon}>💹</span>
        <span className={styles.title}>{data.label || "Trade"}</span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.label}>Type:</span>
          <span className={`${styles.badge} ${styles[data.type?.toLowerCase() || 'long']}`}>
            {data.type || "LONG"}
          </span>
        </div>
        
        <div className={styles.row}>
          <span className={styles.label}>Qty:</span>
          <span className={styles.value}>{data.quantity || "0.01"}</span>
        </div>
        
        <div className={styles.row}>
          <span className={styles.label}>Symbol:</span>
          <span className={styles.value}>{data.symbol || "SOL"}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}

export default memo(TradeNode);
