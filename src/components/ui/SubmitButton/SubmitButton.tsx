import { ComponentPropsWithoutRef } from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps extends ComponentPropsWithoutRef<"button"> {
}

const SubmitButton = ({ children, className, disabled, ...props }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`${styles.submitButton} ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      { children }
    </button>
  );
};

export default SubmitButton;