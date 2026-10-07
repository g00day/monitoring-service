import styles from "./StatusLabel.module.css";

interface StatusLabelProps {
  status: "online" | "offline";
  text: string;
}

const StatusLabel = ({ status, text }: StatusLabelProps) => {
  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      <span className={styles.statusDot} />
      {text}
    </span>
  );
};

export default StatusLabel;