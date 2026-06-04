/**
 * One-off: add columns that exist in the Payload schema but not yet in Neon.
 * Run: pnpm exec tsx scripts/sync-schema.mts
 */
import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  const client = new Client({ connectionString })
  await client.connect()

  await client.query(`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS tags varchar DEFAULT '' NOT NULL;
  `)

  await client.query(`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS likes numeric DEFAULT 0;
  `)

  await client.end()
  console.log('Schema sync complete: posts.tags and posts.likes are present.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
