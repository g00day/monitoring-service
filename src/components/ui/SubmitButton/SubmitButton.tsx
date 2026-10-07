import { ComponentPropsWithoutRef } from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps extends ComponentPropsWithoutRef<"button"> {
  coloringType: "submit" | "cancel"; 
}

const SubmitButton = ({ children, coloringType, className, disabled, ...props }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`${styles.submitButton} ${coloringType == "submit" ? styles.blueBtn : styles.redBtn} ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      { children }
    </button>
  );
};

export default SubmitButton;