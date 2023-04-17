import { FC, ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
