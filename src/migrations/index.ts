import * as migration_20260604_082844 from './20260604_082844';

export const migrations = [
  {
    up: migration_20260604_082844.up,
    down: migration_20260604_082844.down,
    name: '20260604_082844'
  },
];
