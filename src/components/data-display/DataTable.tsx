import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  filter?: (row: T, term: string) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  renderActions?: (row: T) => React.ReactNode;
  serverInfo?: { page: number; pageSize: number; total: number };
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  selectable,
  onSelectionChange,
  renderActions,
  serverInfo,
  onPageChange,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ id: string; direction: 'asc' | 'desc' } | null>(null);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      columns.some((column) => column.filter?.(row, search.toLowerCase()) ?? false),
    );
  }, [search, data, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((col) => col.id === sort.id);
    if (!column) return filtered;
    return [...filtered].sort((a, b) => {
      const aValue = column.accessor(a);
      const bValue = column.accessor(b);
      if (aValue === bValue) return 0;
      return sort.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filtered, sort, columns]);

  const toggleSelection = (rowIndex: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      onSelectionChange?.(Array.from(next).map((index) => sorted[index]));
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="search"
          placeholder="Search"
          className="w-64 rounded border border-slate-300 px-3 py-2 text-sm"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {selectable && selectedRows.size > 0 ? (
          <span className="text-sm text-slate-500">{selectedRows.size} selected</span>
        ) : null}
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {selectable ? <th className="px-3 py-2" aria-label="Select row" /> : null}
              {columns.map((column) => (
                <th key={column.id} scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase">
                  <button
                    type="button"
                    className={clsx(
                      'flex items-center gap-1 text-left text-xs uppercase',
                      column.sortable ? 'cursor-pointer' : 'cursor-default',
                    )}
                    onClick={() =>
                      column.sortable &&
                      setSort((previous) => {
                        if (!previous || previous.id !== column.id) {
                          return { id: column.id, direction: 'asc' };
                        }
                        return {
                          id: column.id,
                          direction: previous.direction === 'asc' ? 'desc' : 'asc',
                        };
                      })
                    }
                  >
                    {column.header}
                    {sort?.id === column.id ? (sort.direction === 'asc' ? '↑' : '↓') : null}
                  </button>
                </th>
              ))}
              {renderActions ? <th className="px-3 py-2 text-right text-xs font-medium uppercase">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {sorted.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                {selectable ? (
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      aria-label="Select row"
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => toggleSelection(rowIndex)}
                    />
                  </td>
                ) : null}
                {columns.map((column) => (
                  <td key={column.id} className="whitespace-nowrap px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
                    {column.accessor(row)}
                  </td>
                ))}
                {renderActions ? (
                  <td className="px-3 py-2 text-right text-sm">{renderActions(row)}</td>
                ) : null}
              </tr>
            ))}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0)} className="px-3 py-4 text-center text-sm text-slate-500">
                  No results
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {serverInfo ? (
        <div className="flex items-center justify-between text-sm">
          <span>
            Page {serverInfo.page} of {Math.ceil(serverInfo.total / serverInfo.pageSize)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded border px-2 py-1"
              onClick={() => onPageChange?.(Math.max(1, serverInfo.page - 1))}
              disabled={serverInfo.page === 1}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded border px-2 py-1"
              onClick={() =>
                onPageChange?.(
                  Math.min(Math.ceil(serverInfo.total / serverInfo.pageSize), serverInfo.page + 1),
                )
              }
              disabled={serverInfo.page >= Math.ceil(serverInfo.total / serverInfo.pageSize)}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
