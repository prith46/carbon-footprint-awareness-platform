import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import StatCard from '../components/StatCard';

const MockIcon = (props) => <svg data-testid="mock-icon" {...props} />;

describe('StatCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('1. Renders the label text correctly', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" />);
    expect(screen.getByText('Total Distance')).toBeInTheDocument();
  });

  it('2. Renders the value correctly', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('3. Renders the subtext when provided', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" subtext="km" />);
    expect(screen.getByText('km')).toBeInTheDocument();
  });

  it('4. Does not render subtext when not provided', () => {
    const { container } = render(<StatCard icon={MockIcon} label="Total Distance" value="100" />);
    expect(container.textContent).not.toContain('km');
  });

  it('5. Applies the correct color scheme for "emerald" (default)', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" />);
    const icons = screen.getAllByTestId('mock-icon');
    expect(icons[0]).toHaveClass('text-emerald-500');
    expect(icons[1]).toHaveClass('text-emerald-400');
    expect(icons[1].parentElement).toHaveClass('bg-emerald-500/10');
  });

  it('6. Applies the correct color scheme for "blue"', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" color="blue" />);
    const icons = screen.getAllByTestId('mock-icon');
    expect(icons[0]).toHaveClass('text-blue-500');
    expect(icons[1]).toHaveClass('text-blue-400');
    expect(icons[1].parentElement).toHaveClass('bg-blue-500/10');
  });

  it('7. Applies the correct color scheme for "red"', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" color="red" />);
    const icons = screen.getAllByTestId('mock-icon');
    expect(icons[0]).toHaveClass('text-red-500');
    expect(icons[1]).toHaveClass('text-red-400');
    expect(icons[1].parentElement).toHaveClass('bg-red-500/10');
  });

  it('8. Falls back to emerald color scheme when an invalid color is provided', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" color="invalid" />);
    const icons = screen.getAllByTestId('mock-icon');
    expect(icons[0]).toHaveClass('text-emerald-500');
    expect(icons[1]).toHaveClass('text-emerald-400');
    expect(icons[1].parentElement).toHaveClass('bg-emerald-500/10');
  });

  it('9. Decorative background icon has aria-hidden="true"', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" />);
    const icons = screen.getAllByTestId('mock-icon');
    expect(icons[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('10. Functional icon has aria-hidden="true"', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value="100" />);
    const icons = screen.getAllByTestId('mock-icon');
    expect(icons[1]).toHaveAttribute('aria-hidden', 'true');
  });

  it('11. Accepts a React node as value and renders it correctly', () => {
    render(<StatCard icon={MockIcon} label="Total Distance" value={<span data-testid="node-value">Node Value</span>} />);
    expect(screen.getByTestId('node-value')).toBeInTheDocument();
    expect(screen.getByText('Node Value')).toBeInTheDocument();
  });
});
