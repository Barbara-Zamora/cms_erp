import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiResource } from '../../../hooks/useApiResource';
import { ContentNode } from '../../../types/models';
import { FormField } from '../../../components/forms/FormField';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { RichTextEditor } from '../../../components/forms/RichTextEditor';
import { Badge } from '../../../components/ui/Badge';
import { Drawer } from '../../../components/overlay/Drawer';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../providers/ToastProvider';
import { apiFetch } from '../../../services/api/client';

const contentSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  scheduleAt: z.string().optional(),
  seoTitle: z.string().min(3),
  seoDescription: z.string().optional(),
  seoCanonical: z.string().optional(),
});

type ContentForm = z.infer<typeof contentSchema>;

export function ContentEditorPage({ mode }: { mode: 'create' | 'edit' }) {
  const { type = 'page', id } = useParams();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);

  const { data } = useApiResource<ContentNode>({
    key: `content-${id}`,
    endpoint: `/content/${id}`,
    enabled: mode === 'edit' && Boolean(id),
  });

  const defaultValues = useMemo<ContentForm>(
    () => ({
      title: data?.title ?? '',
      slug: data?.slug ?? '',
      excerpt: data?.excerpt ?? '',
      content: data?.content ?? '<p></p>',
      status: data?.status ?? 'draft',
      scheduleAt: data?.scheduleAt ?? '',
      seoTitle: data?.seo.title ?? '',
      seoDescription: data?.seo.description ?? '',
      seoCanonical: data?.seo.canonical ?? '',
    }),
    [data],
  );

  const form = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues,
    values: defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    apiFetch(`/content/${id}/versions`).then((payload) => {
      setVersionHistory(payload as any[]);
    });
  }, [id, mode]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;
      const timeout = setTimeout(() => {
        if (mode === 'edit' && id) {
          apiFetch(`/content/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              ...data,
              ...value,
              seo: {
                title: value.seoTitle,
                description: value.seoDescription,
                canonical: value.seoCanonical,
              },
            }),
          })
            .then(() => pushToast({ title: 'Autosaved', tone: 'info' }))
            .catch((error) => pushToast({ title: 'Autosave failed', description: error.message, tone: 'error' }));
        }
      }, 1500);
      return () => clearTimeout(timeout);
    });
    return () => subscription.unsubscribe();
  }, [form, mode, id, data, pushToast]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: Partial<ContentNode> = {
      type,
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      content: values.content,
      status: values.status,
      scheduleAt: values.scheduleAt,
      seo: {
        title: values.seoTitle,
        description: values.seoDescription,
        canonical: values.seoCanonical,
      },
      coverImage: data?.coverImage,
      authorId: data?.authorId ?? '1',
      relations: data?.relations ?? [],
      translations: data?.translations ?? [],
      version: data?.version ?? 1,
    };

    if (mode === 'create') {
      const created = await apiFetch<ContentNode>('/content', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      pushToast({ title: 'Draft created', tone: 'success' });
      navigate(`/admin/content/${created.type}/${created.id}`);
    } else if (id) {
      await apiFetch<ContentNode>(`/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      pushToast({ title: 'Content updated', tone: 'success' });
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant={form.watch('status') === 'published' ? 'success' : 'warning'}>
            {form.watch('status')}
          </Badge>
          <Button type="button" variant="ghost" onClick={() => setVersionsOpen(true)}>
            View history
          </Button>
        </div>
        <FormField label="Title" id="title" required error={form.formState.errors.title}>
          <Input id="title" {...form.register('title')} />
        </FormField>
        <FormField label="Slug" id="slug" required error={form.formState.errors.slug}>
          <Input id="slug" {...form.register('slug')} />
        </FormField>
        <FormField label="Excerpt" id="excerpt" error={form.formState.errors.excerpt}>
          <Textarea id="excerpt" rows={3} {...form.register('excerpt')} />
        </FormField>
        <FormField label="Content" id="content" required error={form.formState.errors.content}>
          <RichTextEditor
            id="content"
            value={form.watch('content')}
            onChange={(value) => form.setValue('content', value)}
          />
        </FormField>
        <Tabs
          value="seo"
          onValueChange={() => undefined}
          items={[
            {
              value: 'seo',
              label: 'SEO',
              content: (
                <div className="space-y-4 rounded-md border border-slate-200 p-4 dark:border-slate-800">
                  <FormField label="SEO title" id="seoTitle" error={form.formState.errors.seoTitle} required>
                    <Input id="seoTitle" {...form.register('seoTitle')} />
                  </FormField>
                  <FormField label="Description" id="seoDescription" error={form.formState.errors.seoDescription}>
                    <Textarea id="seoDescription" rows={3} {...form.register('seoDescription')} />
                  </FormField>
                  <FormField label="Canonical" id="seoCanonical" error={form.formState.errors.seoCanonical}>
                    <Input id="seoCanonical" {...form.register('seoCanonical')} />
                  </FormField>
                  <div className="rounded border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                    <p>Search preview:</p>
                    <p className="font-semibold text-indigo-600">{form.watch('seoTitle')}</p>
                    <p className="text-sm">{form.watch('seoDescription')}</p>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold">Status & scheduling</h2>
          <div className="mt-3 space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" value="draft" {...form.register('status')} /> Draft
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="published" {...form.register('status')} /> Published
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="scheduled" {...form.register('status')} /> Scheduled
            </label>
            {form.watch('status') === 'scheduled' ? (
              <Input type="datetime-local" {...form.register('scheduleAt')} />
            ) : null}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold">Actions</h2>
          <div className="mt-3 space-y-2">
            <Button type="submit" className="w-full">
              Save draft
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={onSubmit}>
              Publish
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </section>
      </div>
      <Drawer title="Versions" open={versionsOpen} onOpenChange={setVersionsOpen}>
        <ul className="space-y-3 text-sm">
          {versionHistory.map((version) => (
            <li key={version.id} className="rounded border border-slate-200 p-3 dark:border-slate-700">
              <p className="font-medium">Version {version.version}</p>
              <p className="text-xs text-slate-500">Updated at {new Date(version.createdAt).toLocaleString()}</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{JSON.stringify(version.diff, null, 2)}</pre>
              <Button
                type="button"
                variant="secondary"
                className="mt-2"
                onClick={() => {
                  if (!id) return;
                  apiFetch(`/content/${id}/restore`, { method: 'POST' }).then(() =>
                    pushToast({ title: 'Version restored', tone: 'success' }),
                  );
                }}
              >
                Restore
              </Button>
            </li>
          ))}
        </ul>
      </Drawer>
    </form>
  );
}
