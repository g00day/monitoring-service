import { useState, type FormEvent } from "react";
import FormField from "@ui/FormField/FormField";
import SubmitButton from "@ui/SubmitButton/SubmitButton";
import { loginClient } from "@api/authClients/loginClient/loginClient";
import styles from "./AuthFormSection.module.css";

const AuthFormSection = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loginClient.login({ username, password });
      window.location.replace("/dashboard"); 
    } catch (err: any) {
      if (err && err.detail) {
        if (typeof err.detail === "string") {
          setError(err.detail);
        } else if (Array.isArray(err.detail) && err.detail.length > 0) {
          setError(err.detail[0].msg || "Ошибка валидации");
        }
      } else {
        setError(err?.message || "Неверный логин или пароль");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.AuthFormSection}>
        <div className={styles.formWrapper}>

            <h2 className={styles.title}>Вход в систему</h2>
            
            <form className={styles.form} onSubmit={handleSubmit}>

                {error && (
                  <div style={{ color: "var(--offline-label-color, #DA1F1F)", fontSize: "14px", fontWeight: 500 }}>
                    {error}
                  </div>
                )}

                <FormField 
                    label="Логин" 
                    id="username" 
                    placeholder="Введите ваш логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                />
                
                <FormField 
                    label="Пароль"
                    placeholder="Введите ваш пароль"
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                
                <SubmitButton coloringType="submit" isLoading={isLoading}>
                    Войти в систему
                </SubmitButton>

            </form>

        </div>
    </section>
  );
};

export default AuthFormSection;
