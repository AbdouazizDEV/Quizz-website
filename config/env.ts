import { localConfig } from './environments/local';
import { productionConfig } from './environments/production';
import { stagingConfig } from './environments/staging';

const ACTIVE_ENV = (import.meta.env.VITE_APP_ENV ?? 'local') as
  | 'local'
  | 'staging'
  | 'production';

const configs = {
  local: localConfig,
  staging: stagingConfig,
  production: productionConfig,
};

export const AppConfig = configs[ACTIVE_ENV] ?? localConfig;
export type AppConfigType = typeof AppConfig;
