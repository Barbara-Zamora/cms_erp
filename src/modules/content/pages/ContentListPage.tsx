import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs } from '../../../components/ui/Tabs';
import { DataTable } from '../../../components/data-display/DataTable';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useApiResource } from '../../../hooks/useApiResource';
import { ContentNode } from '../../../types/models';
import { Drawer } from '../../../components/overlay/Drawer';
import { ImagePreview } from '../../../components/data-display/ImagePreview';
import { usePermission } from '../../../hooks/usePermission';
import { Skeleton } from '../../../components/ui/Skeleton';

interface ContentResponse {
  data: ContentNode[];
  pagination: { page: number; pageSize: number; total: number };
}

const tabs = [
  { value: 'pages', label: 'Pages', type: 'page' },
  { value: 'posts', label: 'Posts', type: 'post' },
  { value: 'custom', label: 'Custom', type: 'custom' },
];

interface ContentListPageProps {
  defaultTab?: string;
}

export function ContentListPage({ defaultTab = 'pages' }: ContentListPageProps) {
  const { type } = useParams();
  const navigate = useNavigate();
  const { allowed } = usePermission('content.update');
  const [preview, setPreview] = useState<ContentNode | null>(null);
  const tabValue = tabs.find((tab) => tab.type === type)?.value ?? defaultTab;
  const activeType = tabs.find((tab) => tab.value === tabValue)?.type ?? 'page';

  const { data, loading } = useApiResource<ContentResponse>({
    key: `content-${activeType}`,
    endpoint: '/content',
    params: { type: activeType },
  });

  const rows = useMemo(() => data?.data ?? [], [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs
          value={tabValue}
          onValueChange={(value) => {
            const nextType = tabs.find((tab) => tab.value === value)?.type ?? 'page';
            navigate(`/admin/content/${nextType}`);
          }}
          items={tabs.map((tab) => ({
            value: tab.value,
            label: tab.label,
            content: <div className="hidden" aria-hidden />,
          }))}
        />
        <Button onClick={() => navigate(`/admin/content/${activeType}/new`)}>New {activeType}</Button>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <DataTable
          data={rows}
          columns={[
            {
              id: 'title',
              header: 'Title',
              accessor: (row) => row.title,
              sortable: true,
              filter: (row, term) => row.title.toLowerCase().includes(term),
            },
            {
              id: 'status',
              header: 'Status',
              accessor: (row) => <Badge variant={row.status === 'published' ? 'success' : 'warning'}>{row.status}</Badge>,
            },
            {
              id: 'author',
              header: 'Author',
              accessor: (row) => row.authorId,
            },
            {
              id: 'updated',
              header: 'Updated',
              accessor: (row) => new Date(row.updatedAt).toLocaleString(),
              sortable: true,
            },
          ]}
          selectable
          onSelectionChange={(selected) => console.log('Selected items', selected)}
          renderActions={(row) => (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setPreview(row)}>
                Preview
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/admin/content/${row.type}/${row.id}`)}
                disabled={!allowed}
              >
                Edit
              </Button>
            </div>
          )}
        />
      )}
      <Drawer title="Preview" open={!!preview} onOpenChange={() => setPreview(null)}>
        {preview ? (
          <div className="space-y-4">
            {preview.coverImage ? (
              <ImagePreview src={preview.coverImage} alt={preview.title} />
            ) : null}
            <h2 className="text-xl font-semibold">{preview.title}</h2>
            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: preview.content }} />
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
