import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonType = 'primary' | 'ghost' | 'icon';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType?: ButtonType;
  children: ReactNode;
};
