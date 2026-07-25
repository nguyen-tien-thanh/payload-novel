import * as migration_20260421_061159 from './20260421_061159'
import * as migration_20260421_141935 from './20260421_141935'
import * as migration_20260421_add_google_id from './20260421_add_google_id'
import * as migration_20260421_add_facebook_id from './20260421_add_facebook_id'
import * as migration_20260421_fix_crawl_rel from './20260421_fix_crawl_rel'
import * as migration_20260425_fix_translator_requests_table from './20260425_fix_translator_requests_table'
import * as migration_20260425_fix_users_role_enum from './20260425_fix_users_role_enum'

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
    up: migration_20260421_add_facebook_id.up,
    down: migration_20260421_add_facebook_id.down,
    name: '20260421_add_facebook_id',
  },
  {
    up: migration_20260421_fix_crawl_rel.up,
    down: migration_20260421_fix_crawl_rel.down,
    name: '20260421_fix_crawl_rel',
  },
  {
    up: migration_20260425_fix_translator_requests_table.up,
    down: migration_20260425_fix_translator_requests_table.down,
    name: '20260425_fix_translator_requests_table',
  },
  {
    up: migration_20260425_fix_users_role_enum.up,
    down: migration_20260425_fix_users_role_enum.down,
    name: '20260425_fix_users_role_enum',
  },
]
