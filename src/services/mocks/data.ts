import { AuditLogEntry, ContentNode, MediaItem, Menu, Role, Setting, Taxonomy, User, Webhook } from '../../types/models';

export const roles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: [
      'content.read',
      'content.create',
      'content.update',
      'content.publish',
      'media.manage',
      'menu.manage',
      'taxonomy.manage',
      'user.manage',
      'role.manage',
      'settings.manage',
      'webhook.manage',
      'audit.read',
    ],
  },
  {
    id: 'editor',
    name: 'Editor',
    permissions: ['content.read', 'content.create', 'content.update', 'media.manage'],
  },
];

export const users: User[] = [
  {
    id: '1',
    name: 'Alex Rivers',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/120?img=1',
    roleId: 'admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Maria Flores',
    email: 'maria@example.com',
    avatar: 'https://i.pravatar.cc/120?img=2',
    roleId: 'editor',
    status: 'active',
  },
];

const now = new Date();

export const contentNodes: ContentNode[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `${index + 1}`,
  type: index % 2 === 0 ? 'page' : 'post',
  title: `Sample ${index % 2 === 0 ? 'Page' : 'Post'} ${index + 1}`,
  slug: `sample-${index + 1}`,
  excerpt: 'A short excerpt for demonstration purposes.',
  content: '<h1>Hello world</h1><p>This is sample content.</p>',
  coverImage: index % 3 === 0 ? `https://picsum.photos/seed/${index}/640/360` : undefined,
  status: index % 4 === 0 ? 'scheduled' : index % 3 === 0 ? 'published' : 'draft',
  scheduleAt: index % 4 === 0 ? new Date(now.getTime() + index * 86400000).toISOString() : null,
  authorId: index % 2 === 0 ? '1' : '2',
  seo: { title: 'Sample SEO title', description: 'Description', ogImage: undefined },
  version: 1,
  translations: [],
  relations: [],
  createdAt: new Date(now.getTime() - index * 86400000).toISOString(),
  updatedAt: new Date(now.getTime() - index * 3600000).toISOString(),
}));

export const mediaLibrary: MediaItem[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `${index + 1}`,
  filename: `image-${index + 1}.jpg`,
  url: `https://picsum.photos/id/${index + 30}/400/300`,
  mime: 'image/jpeg',
  size: 120000 + index * 3000,
  width: 400,
  height: 300,
  alt: `Image ${index + 1}`,
  tags: ['sample'],
  createdAt: new Date(now.getTime() - index * 7200000).toISOString(),
  createdBy: '1',
}));

export const taxonomies: Taxonomy[] = [
  { id: 'cat-news', type: 'category', slug: 'news', name: 'News', description: 'Latest updates' },
  { id: 'cat-guides', type: 'category', slug: 'guides', name: 'Guides', description: 'How-to articles' },
  { id: 'tag-design', type: 'tag', slug: 'design', name: 'Design', description: 'Design resources' },
];

export const menus: Menu[] = [
  {
    id: 'main',
    name: 'Main navigation',
    location: 'header',
    status: 'published',
    items: [
      { id: 'item-1', label: 'Home', url: '/', target: '_self' },
      {
        id: 'item-2',
        label: 'Blog',
        url: '/blog',
        target: '_self',
        children: [
          { id: 'item-2-1', label: 'News', url: '/blog/news' },
          { id: 'item-2-2', label: 'Guides', url: '/blog/guides' },
        ],
      },
    ],
  },
];

export const auditLogs: AuditLogEntry[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `${index + 1}`,
  userId: index % 2 === 0 ? '1' : '2',
  action: index % 2 === 0 ? 'content.updated' : 'content.published',
  entity: 'content',
  entityId: `${index + 1}`,
  diff: { title: `Updated title ${index + 1}` },
  timestamp: new Date(now.getTime() - index * 3600000).toISOString(),
  ip: '127.0.0.1',
}));

export const webhooks: Webhook[] = [
  {
    id: 'wh-1',
    name: 'Deploy hook',
    url: 'https://example.com/webhook',
    secret: 'abc123',
    events: ['content.published', 'media.uploaded'],
    isActive: true,
  },
];

export const settings: Setting = {
  siteName: 'Modern CMS',
  locales: ['en', 'es'],
  defaultLocale: 'en',
  timezone: 'UTC',
  currency: 'USD',
  dateFormat: 'yyyy-MM-dd',
  analyticsId: 'G-XXXXXXX',
  smtp: {
    host: 'smtp.example.com',
    port: 587,
    username: 'noreply@example.com',
  },
  mediaMaxSizeMB: 20,
  thumbnailPresets: [
    { name: 'thumb', width: 150, height: 150 },
    { name: 'medium', width: 400, height: 300 },
    { name: 'large', width: 1280, height: 720 },
  ],
};
