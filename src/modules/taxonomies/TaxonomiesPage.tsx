import { useState } from 'react';
import { useApiResource } from '../../hooks/useApiResource';
import { Taxonomy } from '../../types/models';
import { DataTable } from '../../components/data-display/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/overlay/Modal';

export function TaxonomiesPage() {
  const { data } = useApiResource<Taxonomy[]>({ key: 'taxonomies', endpoint: '/taxonomies' });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Taxonomy>({ id: '', type: 'category', slug: '', name: '', description: '' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Taxonomies</h1>
        <Button onClick={() => setOpen(true)}>Create</Button>
      </div>
      <DataTable
        data={data ?? []}
        columns={[
          { id: 'name', header: 'Name', accessor: (row) => row.name },
          { id: 'type', header: 'Type', accessor: (row) => row.type },
          { id: 'slug', header: 'Slug', accessor: (row) => row.slug },
        ]}
      />
      <Modal title="New taxonomy" open={open} onOpenChange={setOpen}>
        <div className="space-y-3 text-sm">
          <label className="space-y-1">
            <span>Name</span>
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span>Slug</span>
            <Input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
          </label>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
