import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, Column } from '../components/data-display/DataTable';

interface Item {
  id: string;
  name: string;
}

describe('DataTable', () => {
  const data: Item[] = [
    { id: '1', name: 'First' },
    { id: '2', name: 'Second' },
  ];
  const columns: Column<Item>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row.name,
      filter: (row, term) => row.name.toLowerCase().includes(term),
    },
  ];

  it('filters rows by search term', () => {
    render(<DataTable data={data} columns={columns} />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'sec' } });
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });

  it('selects rows when selectable', () => {
    const handler = jest.fn();
    render(<DataTable data={data} columns={columns} selectable onSelectionChange={handler} />);
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(handler).toHaveBeenCalledWith([data[0]]);
  });
});
