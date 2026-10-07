import FormField from "@ui/FormField/FormField";
import SubmitButton from "@ui/SubmitButton/SubmitButton";


import styles from "./AuthFormSection.module.css";



const AuthFormSection = () => {


  return (
    <section className={styles.AuthFormSection}>
        <div className={styles.formWrapper}>

            <h2 className={styles.title}>Вход в систему</h2>
            
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>

                <FormField 
                    label="Логин" 
                    id="username" 
                    placeholder="Введите ваш логин"
                />
                
                <FormField 
                    label="Пароль"
                    placeholder="Введите ваш пароль"
                    id="password" 
                    type="password" 
                />
                
                <SubmitButton coloringType="submit">
                    Войти в систему
                </SubmitButton>

            </form>

        </div>
    </section>
  );


};

export default AuthFormSection;