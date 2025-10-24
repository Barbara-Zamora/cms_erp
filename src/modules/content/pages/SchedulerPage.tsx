import { useApiResource } from '../../../hooks/useApiResource';
import { ContentNode } from '../../../types/models';
import { DataTable } from '../../../components/data-display/DataTable';
import { Badge } from '../../../components/ui/Badge';

interface ContentResponse {
  data: ContentNode[];
  pagination: { page: number; pageSize: number; total: number };
}

export function SchedulerPage() {
  const { data } = useApiResource<ContentResponse>({ key: 'scheduled', endpoint: '/content' });
  const rows = (data?.data ?? []).filter((item) => item.status === 'scheduled');

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Scheduled publications</h1>
      <DataTable
        data={rows}
        columns={[
          { id: 'title', header: 'Title', accessor: (row) => row.title },
          {
            id: 'when',
            header: 'Scheduled for',
            accessor: (row) => new Date(row.scheduleAt ?? '').toLocaleString(),
          },
          {
            id: 'status',
            header: 'Status',
            accessor: (row) => <Badge variant="warning">{row.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}
