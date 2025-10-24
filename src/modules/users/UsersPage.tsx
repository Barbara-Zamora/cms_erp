import { useApiResource } from '../../hooks/useApiResource';
import { User } from '../../types/models';
import { DataTable } from '../../components/data-display/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/overlay/Modal';
import { useState } from 'react';
import { Input } from '../../components/ui/Input';

export function UsersPage() {
  const { data } = useApiResource<User[]>({ key: 'users', endpoint: '/users' });
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <Button onClick={() => setOpen(true)}>Invite user</Button>
      </div>
      <DataTable
        data={data ?? []}
        columns={[
          { id: 'name', header: 'Name', accessor: (row) => row.name },
          { id: 'email', header: 'Email', accessor: (row) => row.email },
          {
            id: 'status',
            header: 'Status',
            accessor: (row) => <Badge variant={row.status === 'active' ? 'success' : 'warning'}>{row.status}</Badge>,
          },
        ]}
      />
      <Modal title="Invite user" open={open} onOpenChange={setOpen}>
        <div className="space-y-3 text-sm">
          <label className="space-y-1">
            <span>Email</span>
            <Input type="email" placeholder="user@example.com" />
          </label>
          <Button onClick={() => setOpen(false)}>Send invite</Button>
        </div>
      </Modal>
    </div>
  );
}
