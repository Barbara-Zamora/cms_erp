import { http, HttpResponse } from 'msw';
import {
  auditLogs,
  contentNodes,
  mediaLibrary,
  menus,
  roles,
  settings,
  taxonomies,
  users,
  webhooks,
} from './data';
import { ContentNode, MediaItem, Role, Setting, User, Webhook } from '../../types/models';

function paginate<T>(items: T[], searchParams: URLSearchParams) {
  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: items.slice(start, end),
    pagination: {
      page,
      pageSize,
      total: items.length,
    },
  };
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = await request.json();
    const user = users.find((item) => item.email === email) ?? users[0];
    return HttpResponse.json({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      user,
      role: roles.find((role) => role.id === user.roleId),
    });
  }),
  http.post('/api/auth/refresh', () =>
    HttpResponse.json({ accessToken: 'mock-token', refreshToken: 'mock-refresh' }),
  ),
  http.get('/api/auth/me', () =>
    HttpResponse.json({ user: users[0], role: roles.find((r) => r.id === users[0].roleId) }),
  ),
  http.get('/api/content', ({ request }) => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const filtered = type ? contentNodes.filter((node) => node.type === type) : contentNodes;
    return HttpResponse.json(paginate(filtered, searchParams));
  }),
  http.get('/api/content/:id', ({ params }) => {
    const item = contentNodes.find((node) => node.id === params.id);
    if (!item) return new HttpResponse('Not found', { status: 404 });
    return HttpResponse.json(item);
  }),
  http.post('/api/content', async ({ request }) => {
    const data = (await request.json()) as ContentNode;
    contentNodes.unshift({ ...data, id: crypto.randomUUID(), version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return HttpResponse.json(contentNodes[0]);
  }),
  http.put('/api/content/:id', async ({ request, params }) => {
    const index = contentNodes.findIndex((node) => node.id === params.id);
    if (index === -1) return new HttpResponse('Not found', { status: 404 });
    const body = (await request.json()) as Partial<ContentNode>;
    const updated = { ...contentNodes[index], ...body, version: contentNodes[index].version + 1, updatedAt: new Date().toISOString() };
    contentNodes[index] = updated;
    return HttpResponse.json(updated);
  }),
  http.get('/api/content/:id/versions', ({ params }) => {
    const node = contentNodes.find((item) => item.id === params.id);
    if (!node) return new HttpResponse('Not found', { status: 404 });
    return HttpResponse.json([
      {
        id: `${node.id}-v${node.version}`,
        version: node.version,
        createdAt: node.updatedAt,
        createdBy: node.authorId,
        diff: { title: node.title },
      },
    ]);
  }),
  http.post('/api/content/:id/restore', ({ params }) => {
    const node = contentNodes.find((item) => item.id === params.id);
    if (!node) return new HttpResponse('Not found', { status: 404 });
    node.version += 1;
    return HttpResponse.json(node);
  }),
  http.get('/api/media', ({ request }) => {
    const { searchParams } = new URL(request.url);
    return HttpResponse.json(paginate(mediaLibrary, searchParams));
  }),
  http.post('/api/media', async ({ request }) => {
    const payload = (await request.json()) as Partial<MediaItem>;
    const item = {
      id: crypto.randomUUID(),
      filename: payload.filename ?? 'upload.jpg',
      url: payload.url ?? 'https://picsum.photos/seed/upload/400/300',
      mime: payload.mime ?? 'image/jpeg',
      size: payload.size ?? 100000,
      width: payload.width ?? 400,
      height: payload.height ?? 300,
      alt: payload.alt ?? 'Uploaded image',
      tags: payload.tags ?? [],
      createdAt: new Date().toISOString(),
      createdBy: payload.createdBy ?? '1',
    };
    mediaLibrary.unshift(item);
    return HttpResponse.json(item);
  }),
  http.put('/api/media/:id', async ({ params, request }) => {
    const index = mediaLibrary.findIndex((item) => item.id === params.id);
    if (index === -1) return new HttpResponse('Not found', { status: 404 });
    const body = (await request.json()) as Partial<MediaItem>;
    mediaLibrary[index] = { ...mediaLibrary[index], ...body };
    return HttpResponse.json(mediaLibrary[index]);
  }),
  http.get('/api/menus', () => HttpResponse.json(menus)),
  http.put('/api/menus/:id', async ({ params, request }) => {
    const index = menus.findIndex((item) => item.id === params.id);
    if (index === -1) return new HttpResponse('Not found', { status: 404 });
    menus[index] = { ...menus[index], ...(await request.json()) };
    return HttpResponse.json(menus[index]);
  }),
  http.get('/api/taxonomies', () => HttpResponse.json(taxonomies)),
  http.get('/api/users', () => HttpResponse.json(users)),
  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as User;
    const created = { ...body, id: crypto.randomUUID() };
    users.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
  http.get('/api/roles', () => HttpResponse.json(roles)),
  http.put('/api/roles/:id', async ({ params, request }) => {
    const index = roles.findIndex((role) => role.id === params.id);
    if (index === -1) return new HttpResponse('Not found', { status: 404 });
    const body = (await request.json()) as Role;
    roles[index] = { ...roles[index], ...body };
    return HttpResponse.json(roles[index]);
  }),
  http.get('/api/settings', () => HttpResponse.json(settings)),
  http.put('/api/settings', async ({ request }) => {
    const body = (await request.json()) as Setting;
    Object.assign(settings, body);
    return HttpResponse.json(settings);
  }),
  http.get('/api/webhooks', () => HttpResponse.json(webhooks)),
  http.post('/api/webhooks', async ({ request }) => {
    const body = (await request.json()) as Webhook;
    const webhook = { ...body, id: crypto.randomUUID() };
    webhooks.push(webhook);
    return HttpResponse.json(webhook);
  }),
  http.post('/api/webhooks/:id/test', ({ params }) =>
    HttpResponse.json({ ok: true, id: params.id, status: 'delivered' }),
  ),
  http.get('/api/audit-log', ({ request }) => {
    const { searchParams } = new URL(request.url);
    return HttpResponse.json(paginate(auditLogs, searchParams));
  }),
];
