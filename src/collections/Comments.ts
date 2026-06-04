import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'approved' } }
    },
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    // Public deletes go through the site action with a per-comment delete token.
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      index: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Not shown on the public site; for moderation only.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'deleteToken',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
        readOnly: true,
      },
      access: {
        read: ({ req: { user } }) => Boolean(user),
        update: () => false,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'approved',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        description: 'Rejected comments are hidden on the blog. New comments publish immediately.',
      },
    },
  ],
}
