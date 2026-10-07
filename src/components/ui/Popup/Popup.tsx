import { ReactNode } from "react";
import styles from "./Popup.module.css";

interface PopupParams {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footerButtons?: ReactNode;
}

const Popup = ({ isOpen, onClose, title, children, footerButtons }: PopupParams) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          &times;
        </button>
        
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.content}>
          {children}
        </div>

        {footerButtons && (
          <div className={styles.footer}>
            {footerButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
