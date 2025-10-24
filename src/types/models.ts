export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roleId: string;
  status: 'active' | 'invited' | 'suspended';
  metadata?: Record<string, unknown>;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  tags: string[];
  createdAt: string;
  createdBy: string;
}

export interface Taxonomy {
  id: string;
  type: 'category' | 'tag' | string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  emoji?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  target?: '_blank' | '_self';
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
  location: 'header' | 'footer' | string;
  status?: 'draft' | 'published';
}

export interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'richtext' | 'number' | 'date' | 'boolean' | 'select' | 'relation' | 'media' | 'repeater';
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface ContentType {
  id: string;
  name: string;
  slug: string;
  fields: ContentField[];
}

export interface NodeTranslation {
  locale: string;
  nodeId: string;
}

export interface NodeVersionDiff {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  diff: Record<string, unknown>;
}

export interface NodeSeo {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export interface ContentNode {
  id: string;
  type: 'page' | 'post' | string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduleAt?: string | null;
  authorId: string;
  seo: NodeSeo;
  version: number;
  translations: NodeTranslation[];
  relations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  diff: Record<string, unknown>;
  timestamp: string;
  ip: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  secret?: string;
  events: string[];
  isActive: boolean;
}

export interface Setting {
  siteName: string;
  locales: string[];
  defaultLocale: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  analyticsId?: string;
  smtp: {
    host: string;
    port: number;
    username: string;
    password?: string;
  };
  mediaMaxSizeMB: number;
  thumbnailPresets: Array<{ name: string; width: number; height: number }>;
}
