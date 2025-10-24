import { useApiResource } from '../../hooks/useApiResource';
import { Role } from '../../types/models';
import { DataTable } from '../../components/data-display/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/overlay/Modal';
import { useState } from 'react';
import { Textarea } from '../../components/ui/Textarea';

export function RolesPage() {
  const { data } = useApiResource<Role[]>({ key: 'roles', endpoint: '/roles' });
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Roles & permissions</h1>
      </div>
      <DataTable
        data={data ?? []}
        columns={[
          { id: 'name', header: 'Role', accessor: (row) => row.name },
          {
            id: 'permissions',
            header: 'Permissions',
            accessor: (row) => row.permissions.join(', '),
          },
        ]}
        renderActions={(row) => (
          <Button
            variant="ghost"
            onClick={() => {
              setRole(row);
              setOpen(true);
            }}
          >
            Edit
          </Button>
        )}
      />
      <Modal title={`Edit ${role?.name ?? ''}`} open={open} onOpenChange={setOpen}>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Permissions (one per line)</span>
          <Textarea
            rows={6}
            value={role?.permissions.join('\n') ?? ''}
            onChange={(event) =>
              role && setRole({ ...role, permissions: event.target.value.split('\n') })
            }
          />
        </label>
      </Modal>
    </div>
  );
}
