import type { Credentials } from '../../types';

export type LoginScreenProps = {
  onSubmit: (credentials: Credentials) => Promise<void>;
  error?: string | null;
};
