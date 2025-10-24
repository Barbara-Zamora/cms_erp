import { useApiResource } from '../../hooks/useApiResource';
import { Webhook } from '../../types/models';
import { DataTable } from '../../components/data-display/DataTable';
import { Button } from '../../components/ui/Button';
import { apiFetch } from '../../services/api/client';
import { useToast } from '../../providers/ToastProvider';

export function WebhooksPage() {
  const { data } = useApiResource<Webhook[]>({ key: 'webhooks', endpoint: '/webhooks' });
  const { pushToast } = useToast();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Webhooks</h1>
      </div>
      <DataTable
        data={data ?? []}
        columns={[
          { id: 'name', header: 'Name', accessor: (row) => row.name },
          { id: 'url', header: 'URL', accessor: (row) => row.url },
          { id: 'events', header: 'Events', accessor: (row) => row.events.join(', ') },
        ]}
        renderActions={(row) => (
          <Button
            variant="secondary"
            onClick={async () => {
              const result = await apiFetch<{ status: string }>(`/webhooks/${row.id}/test`, {
                method: 'POST',
              });
              pushToast({ title: 'Webhook test', description: result.status, tone: 'info' });
            }}
          >
            Test
          </Button>
        )}
      />
    </div>
  );
}
