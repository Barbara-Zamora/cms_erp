import { useApiResource } from '../../hooks/useApiResource';
import { AuditLogEntry } from '../../types/models';
import { DataTable } from '../../components/data-display/DataTable';

interface AuditResponse {
  data: AuditLogEntry[];
  pagination: { page: number; pageSize: number; total: number };
}

export function AuditLogPage() {
  const { data } = useApiResource<AuditResponse>({ key: 'audit', endpoint: '/audit-log' });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Audit log</h1>
      <DataTable
        data={data?.data ?? []}
        columns={[
          { id: 'action', header: 'Action', accessor: (row) => row.action },
          { id: 'entity', header: 'Entity', accessor: (row) => `${row.entity} #${row.entityId}` },
          { id: 'user', header: 'User', accessor: (row) => row.userId },
          { id: 'timestamp', header: 'When', accessor: (row) => new Date(row.timestamp).toLocaleString() },
        ]}
      />
    </div>
  );
}
