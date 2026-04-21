import * as migration_20260421_061159 from './20260421_061159';
import * as migration_20260421_141935 from './20260421_141935';
import * as migration_20260421_add_google_id from './20260421_add_google_id';
import * as migration_20260421_fix_crawl_rel from './20260421_fix_crawl_rel';

export const migrations = [
  {
    up: migration_20260421_061159.up,
    down: migration_20260421_061159.down,
    name: '20260421_061159',
  },
  {
    up: migration_20260421_141935.up,
    down: migration_20260421_141935.down,
    name: '20260421_141935',
  },
  {
    up: migration_20260421_add_google_id.up,
    down: migration_20260421_add_google_id.down,
    name: '20260421_add_google_id',
  },
  {
    up: migration_20260421_fix_crawl_rel.up,
    down: migration_20260421_fix_crawl_rel.down,
    name: '20260421_fix_crawl_rel'
  },
];
