import styles from '../../styles/Button.module.scss';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  children: ReactNode;
}

const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const className = styles[variant];

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
