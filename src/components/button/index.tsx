import { buildClassName } from './helpers';
import './style.css';
import type { ButtonProps } from './type';

export const Button = ({
  buttonType = 'primary',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button type={type} className={buildClassName(buttonType, className)} {...rest}>
    {children}
  </button>
);

export type { ButtonProps, ButtonType } from './type';
