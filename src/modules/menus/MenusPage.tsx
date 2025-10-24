import { useState } from 'react';
import { useApiResource } from '../../hooks/useApiResource';
import { Menu, MenuItem } from '../../types/models';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiFetch } from '../../services/api/client';
import { useToast } from '../../providers/ToastProvider';

export function MenusPage() {
  const { data, setData } = useApiResource<Menu[]>({ key: 'menus', endpoint: '/menus' });
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const { pushToast } = useToast();

  const addMenuItem = () => {
    if (!selectedMenu) return;
    const item: MenuItem = {
      id: crypto.randomUUID(),
      label: 'New item',
      url: '/',
      children: [],
    };
    const updated: Menu = { ...selectedMenu, items: [...selectedMenu.items, item] };
    setSelectedMenu(updated);
  };

  const saveMenu = async () => {
    if (!selectedMenu) return;
    await apiFetch(`/menus/${selectedMenu.id}`, {
      method: 'PUT',
      body: JSON.stringify(selectedMenu),
    });
    pushToast({ title: 'Menu saved', tone: 'success' });
    setData((menus) => menus?.map((menu) => (menu.id === selectedMenu.id ? selectedMenu : menu)) ?? []);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
      <aside className="space-y-3">
        <h2 className="text-sm font-semibold">Locations</h2>
        <ul className="space-y-2">
          {(data ?? []).map((menu) => (
            <li key={menu.id}>
              <button
                type="button"
                className={`w-full rounded border px-3 py-2 text-left text-sm ${
                  selectedMenu?.id === menu.id ? 'border-primary' : 'border-slate-200'
                }`}
                onClick={() => setSelectedMenu(menu)}
              >
                {menu.name} ({menu.location})
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {selectedMenu ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">{selectedMenu.name}</h1>
              <Button onClick={addMenuItem}>Add item</Button>
            </div>
            <ul className="space-y-3">
              {selectedMenu.items.map((item, index) => (
                <li key={item.id} className="rounded border border-slate-200 p-3 text-sm dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Input
                      value={item.label}
                      onChange={(event) => {
                        const next = [...selectedMenu.items];
                        next[index] = { ...item, label: event.target.value };
                        setSelectedMenu({ ...selectedMenu, items: next });
                      }}
                    />
                    <Input
                      value={item.url}
                      onChange={(event) => {
                        const next = [...selectedMenu.items];
                        next[index] = { ...item, url: event.target.value };
                        setSelectedMenu({ ...selectedMenu, items: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setSelectedMenu({
                          ...selectedMenu,
                          items: selectedMenu.items.filter((candidate) => candidate.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  {item.children?.length ? (
                    <ul className="mt-3 space-y-2 border-l-2 border-dashed border-slate-200 pl-3">
                      {item.children.map((child, childIndex) => (
                        <li key={child.id} className="rounded border border-slate-200 p-2 text-sm">
                          <Input
                            value={child.label}
                            onChange={(event) => {
                              const next = [...(item.children ?? [])];
                              next[childIndex] = { ...child, label: event.target.value };
                              const items = [...selectedMenu.items];
                              items[index] = { ...item, children: next };
                              setSelectedMenu({ ...selectedMenu, items });
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <Button onClick={saveMenu}>Save menu</Button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Select a menu to start editing.</p>
        )}
      </section>
    </div>
  );
}
