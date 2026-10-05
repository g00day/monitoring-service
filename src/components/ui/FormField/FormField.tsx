import { ComponentPropsWithoutRef } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
}

const FormField = ({ label, id, ...props }: FormFieldProps) => {
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
        {...props}
      />
    </div>
  );
};

export default FormField;