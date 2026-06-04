import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { Comments } from '@/collections/Comments'
import { Media } from '@/collections/Media'
import { Posts } from '@/collections/Posts'
import { Users } from '@/collections/Users'
import { s3Storage } from '@payloadcms/storage-s3'

function getS3PublicBaseUrl(): string {
  const custom = process.env.S3_PUBLIC_URL?.replace(/\/$/, '')
  if (custom) return custom

  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION
  if (!bucket || !region) return ''

  return `https://${bucket}.s3.${region}.amazonaws.com`
}

function buildS3FileUrl({
  filename,
  prefix,
}: {
  filename?: string | null
  prefix?: string | null
}): string {
  if (!filename || typeof filename !== 'string') return ''

  const base = getS3PublicBaseUrl()
  if (!base) return ''

  const key = prefix ? `${prefix}/${filename}` : filename
  return `${base}/${key}`
}

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Media, Posts, Comments],
  admin: {
    user: Users.slug,
  },

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          // Serve files directly from S3 instead of proxying through Payload (/api/...).
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            buildS3FileUrl({ filename, prefix }),
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
        // Only set for S3-compatible providers (R2, MinIO). Omit for standard AWS S3.
        ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
      },
    }),
  ],
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!

  sharp,
})