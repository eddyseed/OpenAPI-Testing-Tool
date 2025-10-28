import styles from '../../styles/Button.module.scss';
import type { ReactNode } from 'react';
const Button = ({ variant = 'primary', children, ...props }: { variant?: string, children: ReactNode }) => {
  const className = styles[variant];

  return (
    <button className={`${className}`} {...props}>
      {children}
    </button>
  );
};
export default Button;