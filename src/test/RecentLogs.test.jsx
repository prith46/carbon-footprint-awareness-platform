import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecentLogs from '../components/RecentLogs';
import { typeLabels } from '../data/labels';

describe('RecentLogs', () => {
  afterEach(() => {
    cleanup();
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('1. Renders "No recent logs yet." when logs is empty', () => {
    renderWithRouter(<RecentLogs logs={[]} />);
    expect(screen.getByText('No recent logs yet.')).toBeInTheDocument();
  });

  it('2. Renders the correct number of log items when logs has entries', () => {
    const logs = [
      { id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01', kgCO2: 10 },
      { id: '2', category: 'food', type: 'beef_meal', date: '2024-01-02', kgCO2: 15 }
    ];
    renderWithRouter(<RecentLogs logs={logs} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('3. Renders log type label correctly for each entry', () => {
    const logs = [{ id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01', kgCO2: 10 }];
    renderWithRouter(<RecentLogs logs={logs} />);
    expect(screen.getByText(typeLabels['car_petrol'])).toBeInTheDocument();
  });

  it('4. Renders log date correctly for each entry', () => {
    const logs = [{ id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01', kgCO2: 10 }];
    renderWithRouter(<RecentLogs logs={logs} />);
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('5. Renders kgCO2 value with 1 decimal place and "+" prefix', () => {
    const logs = [{ id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01', kgCO2: 10.55 }];
    renderWithRouter(<RecentLogs logs={logs} />);
    expect(screen.getByText('+10.6')).toBeInTheDocument();
  });

  it('6. Renders "—" when kgCO2 is NaN', () => {
    const logs = [{ id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01', kgCO2: NaN }];
    renderWithRouter(<RecentLogs logs={logs} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('7. Renders "—" when kgCO2 is undefined', () => {
    const logs = [{ id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01' }];
    renderWithRouter(<RecentLogs logs={logs} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('8. Renders the correct category icon for transport', () => {
    const logs = [{ id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01', kgCO2: 10 }];
    const { container } = renderWithRouter(<RecentLogs logs={logs} />);
    const svg = container.querySelector('svg.text-blue-400');
    expect(svg).toBeInTheDocument();
  });

  it('9. Renders the fallback Activity icon for unknown category', () => {
    const logs = [{ id: '1', category: 'unknown_cat', type: 'car_petrol', date: '2024-01-01', kgCO2: 10 }];
    const { container } = renderWithRouter(<RecentLogs logs={logs} />);
    const svg = container.querySelector('svg.text-slate-400');
    expect(svg).toBeInTheDocument();
  });

  it('10. Log items are rendered inside a <ul> element', () => {
    const logs = [{ id: '1', category: 'transport', type: 'car_petrol', date: '2024-01-01', kgCO2: 10 }];
    renderWithRouter(<RecentLogs logs={logs} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('11. "View All" link has aria-label="View all activity logs"', () => {
    renderWithRouter(<RecentLogs logs={[]} />);
    expect(screen.getByLabelText('View all activity logs')).toBeInTheDocument();
  });

  it('12. "View All" link points to "/log"', () => {
    renderWithRouter(<RecentLogs logs={[]} />);
    const link = screen.getByLabelText('View all activity logs');
    expect(link.getAttribute('href')).toBe('/log');
  });

  it('13. Empty state message is inside a <li> element, not a direct child of <ul>', () => {
    renderWithRouter(<RecentLogs logs={[]} />);
    const emptyText = screen.getByText('No recent logs yet.');
    const li = emptyText.closest('li');
    expect(li).toBeInTheDocument();
    expect(li.parentElement.tagName).toBe('UL');
  });
});
