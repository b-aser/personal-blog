import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path, e.g. "my-first-post" → /blog/my-first-post',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    {
      name: 'tags',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'The tags of the post',
      },
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Updated when readers like a post on the site.',
      },
      access: {
        update: () => false,
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',  // or whatever your users slug is
      hasMany: true,        // allows multiple authors per post
      required: true,
      admin: {
        readOnly: false,
        position: 'sidebar',
        description: 'The authors of the post',
        width: '50%',
        condition: (data) => data?.status === 'published',
        
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && data?.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        if (operation === 'update' && data?.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
