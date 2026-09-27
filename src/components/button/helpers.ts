import type { ButtonType } from './type';

export const buildClassName = (buttonType: ButtonType, className?: string): string => {
  const classes = ['button', `button--${buttonType}`];
  if (className) classes.push(className);
  return classes.join(' ');
};
