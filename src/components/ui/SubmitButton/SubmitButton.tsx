import type { ComponentPropsWithoutRef } from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps extends ComponentPropsWithoutRef<"button"> {
  coloringType: "submit" | "cancel"; 
  isLoading?: boolean;
}

const SubmitButton = ({ children, coloringType, className, disabled, isLoading = false, ...props }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`${styles.submitButton} ${coloringType == "submit" ? styles.blueBtn : styles.redBtn} ${className || ""}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      { children }
    </button>
  );
};

export default SubmitButton;
