import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import LogTable from '../components/LogTable';
import { LOGS_PER_PAGE } from '../data/constants';
import { typeLabels } from '../data/labels';

describe('LogTable', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const generateLogs = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `id-${i}`,
      date: '2024-01-01',
      category: 'transport',
      type: 'car_petrol',
      quantity: 10,
      kgCO2: 15.123
    }));
  };

  it('1. Renders empty state "No activity logs yet." when logs is empty', () => {
    render(<LogTable logs={[]} onDelete={() => {}} />);
    expect(screen.getByText('No activity logs yet.')).toBeInTheDocument();
  });

  it('2. Renders the correct number of rows when logs has entries', () => {
    const logs = generateLogs(3);
    render(<LogTable logs={logs} onDelete={() => {}} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows + 0 empty state rows = 4 rows
    expect(rows).toHaveLength(4);
  });

  it('3. Renders log date, category, type, quantity correctly', () => {
    const logs = [{ id: '1', date: '2024-05-10', category: 'food', type: 'beef_meal', quantity: 2 }];
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByText('2024-05-10')).toBeInTheDocument();
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText(typeLabels['beef_meal'])).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('4. Renders kgCO2 with 2 decimal places when valid', () => {
    const logs = [{ id: '1', date: '2024-05-10', category: 'food', type: 'beef_meal', quantity: 2, kgCO2: 15.123 }];
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByText('15.12')).toBeInTheDocument();
  });

  it('5. Renders "—" when kgCO2 is NaN', () => {
    const logs = [{ id: '1', date: '2024-05-10', category: 'food', type: 'beef_meal', quantity: 2, kgCO2: NaN }];
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('6. Renders "—" when kgCO2 is undefined', () => {
    const logs = [{ id: '1', date: '2024-05-10', category: 'food', type: 'beef_meal', quantity: 2 }];
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('7. Delete button has a unique aria-label containing category, type, date and quantity', () => {
    const logs = [{ id: '1', date: '2024-05-10', category: 'food', type: 'beef_meal', quantity: 2 }];
    render(<LogTable logs={logs} onDelete={() => {}} />);
    const expectedLabel = `Delete food ${typeLabels['beef_meal']} entry from 2024-05-10, 2 units`;
    expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument();
  });

  it('8. Clicking delete button calls onDelete with the correct log id', () => {
    const logs = [{ id: 'id-test', date: '2024-05-10', category: 'food', type: 'beef_meal', quantity: 2 }];
    const onDeleteMock = vi.fn();
    render(<LogTable logs={logs} onDelete={onDeleteMock} />);
    fireEvent.click(screen.getByTitle('Delete log'));
    expect(onDeleteMock).toHaveBeenCalledWith('id-test');
  });

  it('9. Pagination is not shown when logs fit on one page', () => {
    const logs = generateLogs(LOGS_PER_PAGE);
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('10. Pagination is shown when logs exceed one page', () => {
    const logs = generateLogs(LOGS_PER_PAGE + 1);
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('11. Previous button is disabled on the first page', () => {
    const logs = generateLogs(LOGS_PER_PAGE + 1);
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('12. Next button is disabled on the last page', () => {
    const logs = generateLogs(LOGS_PER_PAGE + 1);
    render(<LogTable logs={logs} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('13. Clicking Next goes to the next page', () => {
    const logs = generateLogs(LOGS_PER_PAGE + 1);
    logs[LOGS_PER_PAGE].date = '9999-12-31';
    render(<LogTable logs={logs} onDelete={() => {}} />);
    
    expect(screen.queryByText('9999-12-31')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('9999-12-31')).toBeInTheDocument();
  });

  it('14. Previous button has aria-label="Go to previous page"', () => {
    const logs = generateLogs(LOGS_PER_PAGE + 1);
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
  });

  it('16. Trash2 icon has aria-hidden="true"', () => {
    const logs = [{ id: '1', date: '2024-05-10', category: 'food', type: 'beef_meal', quantity: 2 }];
    const { container } = render(<LogTable logs={logs} onDelete={() => {}} />);
    const trashIcon = container.querySelector('svg');
    expect(trashIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('17. paginatedLogs updates correctly after clicking Next', () => {
    const logs = generateLogs(LOGS_PER_PAGE + 1);
    logs[LOGS_PER_PAGE].date = '9999-12-31';
    render(<LogTable logs={logs} onDelete={() => {}} />);
    
    // Page 1 is visible
    expect(screen.getAllByRole('row').length).toBe(LOGS_PER_PAGE + 1); // +1 for header
    
    // Go to next page
    fireEvent.click(screen.getByText('Next'));
    
    // Page 2 is visible
    expect(screen.getAllByRole('row').length).toBe(2); // 1 item + 1 header
    expect(screen.getByText('9999-12-31')).toBeInTheDocument();
  });

  it('18. Clicking Previous after clicking Next returns to page 1', () => {
    const logs = generateLogs(LOGS_PER_PAGE + 1);
    logs[0].date = '1111-11-11';
    render(<LogTable logs={logs} onDelete={() => {}} />);
    
    // Go to next page
    fireEvent.click(screen.getByText('Next'));
    // Go back to previous page
    fireEvent.click(screen.getByText('Previous'));
    
    expect(screen.getByText('1111-11-11')).toBeInTheDocument();
  });

  it('19. currentPage clamps when logs shrink below current page', () => {
    const logs = generateLogs(LOGS_PER_PAGE * 2);
    const { rerender } = render(<LogTable logs={logs} onDelete={() => {}} />);
    
    // Go to page 2
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Next').parentElement).toHaveTextContent('Page 2 of 2');
    
    // Shrink logs to 1 page
    const smallerLogs = generateLogs(LOGS_PER_PAGE);
    rerender(<LogTable logs={smallerLogs} onDelete={() => {}} />);
    
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('20. Renders raw type when log.type is not in typeLabels', () => {
    const logs = [{ id: '1', date: '2024-05-10', category: 'food', type: 'unknown_type', quantity: 2 }];
    render(<LogTable logs={logs} onDelete={() => {}} />);
    expect(screen.getByText('unknown_type')).toBeInTheDocument();
  });
});
