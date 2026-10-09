import type { ComponentPropsWithoutRef } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  padding?: string;
}

const FormField = ({ label, id, padding="16px", ...props }: FormFieldProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={styles.input}
        style={{ padding: padding }}
        {...props}
      />
    </div>
  );
};

export default FormField;
