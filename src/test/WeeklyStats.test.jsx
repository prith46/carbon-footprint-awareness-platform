import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import WeeklyStats from '../components/WeeklyStats';

describe('WeeklyStats', () => {
  afterEach(() => {
    cleanup();
  });

  it('1. Renders "0.0" for 7-Day Total when sevenDayLogs is empty', () => {
    render(<WeeklyStats sevenDayLogs={[]} />);
    expect(screen.getAllByText('0.0')[0]).toBeInTheDocument();
  });

  it('2. Renders "0.0" for Daily Average when sevenDayLogs is empty', () => {
    render(<WeeklyStats sevenDayLogs={[]} />);
    expect(screen.getAllByText('0.0')[1]).toBeInTheDocument();
  });

  it('3. Renders "N/A" for Best Day when sevenDayLogs is empty', () => {
    render(<WeeklyStats sevenDayLogs={[]} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('4. Correctly sums valid numeric values for 7-Day Total', () => {
    const logs = [{ name: 'Mon', value: 10 }, { name: 'Tue', value: 20 }];
    render(<WeeklyStats sevenDayLogs={logs} />);
    expect(screen.getByText('30.0')).toBeInTheDocument();
  });

  it('5. Correctly computes daily average (total / 7)', () => {
    const logs = [{ name: 'Mon', value: 10 }, { name: 'Tue', value: 25 }];
    render(<WeeklyStats sevenDayLogs={logs} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('6. Identifies the correct best day (lowest non-zero value)', () => {
    const logs = [{ name: 'Mon', value: 10 }, { name: 'Tue', value: 0 }, { name: 'Wed', value: 5 }];
    render(<WeeklyStats sevenDayLogs={logs} />);
    expect(screen.getByText('Wed (5.0 kg)')).toBeInTheDocument();
  });

  it('7. Shows "N/A" for Best Day when all values are zero', () => {
    const logs = [{ name: 'Mon', value: 0 }, { name: 'Tue', value: 0 }];
    render(<WeeklyStats sevenDayLogs={logs} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('8. Filters out non-numeric values before computing total', () => {
    const logs = [{ name: 'Mon', value: 10 }, { name: 'Tue', value: '20' }, { name: 'Wed', value: null }];
    render(<WeeklyStats sevenDayLogs={logs} />);
    // Total should be 10.0
    expect(screen.getByText('10.0')).toBeInTheDocument();
  });

  it('9. Renders "0.0" when total is NaN or not finite', () => {
    const logs = [{ name: 'Mon', value: NaN }, { name: 'Tue', value: Infinity }];
    render(<WeeklyStats sevenDayLogs={logs} />);
    expect(screen.getAllByText('0.0')[0]).toBeInTheDocument();
  });

  it('10. All three decorative icons have aria-hidden="true"', () => {
    const { container } = render(<WeeklyStats sevenDayLogs={[]} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(3);
    svgs.forEach(svg => {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('11. Renders the correct day name in Best Day string', () => {
    const logs = [{ name: 'Friday', value: 1 }];
    render(<WeeklyStats sevenDayLogs={logs} />);
    expect(screen.getByText('Friday (1.0 kg)')).toBeInTheDocument();
  });
});
