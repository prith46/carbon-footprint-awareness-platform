import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ChartTooltip from '../components/ChartTooltip';

describe('ChartTooltip', () => {
  afterEach(() => {
    cleanup();
  });

  it('1. Does not render when active is false', () => {
    const { container } = render(<ChartTooltip active={false} payload={[{ value: 10 }]} label="Test Label" />);
    expect(container.firstChild).toBeNull();
  });

  it('2. Does not render when payload is empty', () => {
    const { container } = render(<ChartTooltip active={true} payload={[]} label="Test Label" />);
    expect(container.firstChild).toBeNull();
  });

  it('3. Does not render when payload value is not a number', () => {
    const { container } = render(<ChartTooltip active={true} payload={[{ value: "10" }]} label="Test Label" />);
    expect(container.firstChild).toBeNull();
  });

  it('4. Does not render when payload value is NaN or Infinity', () => {
    const { container: containerNaN } = render(<ChartTooltip active={true} payload={[{ value: NaN }]} label="Test Label" />);
    expect(containerNaN.firstChild).toBeNull();
    cleanup();

    const { container: containerInfinity } = render(<ChartTooltip active={true} payload={[{ value: Infinity }]} label="Test Label" />);
    expect(containerInfinity.firstChild).toBeNull();
  });

  it('5. Renders correctly with a valid integer value — shows the value without decimals', () => {
    render(<ChartTooltip active={true} payload={[{ value: 10 }]} label="Test Label" />);
    expect(screen.getByText('10 kg CO₂')).toBeInTheDocument();
  });

  it('6. Renders correctly with a valid float value — shows value with 1 decimal place', () => {
    render(<ChartTooltip active={true} payload={[{ value: 10.45 }]} label="Test Label" />);
    expect(screen.getByText('10.4 kg CO₂')).toBeInTheDocument();
  });

  it('7. Renders the correct unit when unit prop is provided', () => {
    render(<ChartTooltip active={true} payload={[{ value: 10 }]} label="Test Label" unit="miles" />);
    expect(screen.getByText('10 miles')).toBeInTheDocument();
  });

  it('8. Renders the default unit "kg CO₂" when no unit prop is provided', () => {
    render(<ChartTooltip active={true} payload={[{ value: 10 }]} label="Test Label" />);
    expect(screen.getByText('10 kg CO₂')).toBeInTheDocument();
  });

  it('9. Renders the label from the label prop when provided', () => {
    render(<ChartTooltip active={true} payload={[{ value: 10, name: "PayloadName" }]} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('10. Falls back to payload[0].name when label is not provided', () => {
    render(<ChartTooltip active={true} payload={[{ value: 10, name: "PayloadName" }]} />);
    expect(screen.getByText('PayloadName')).toBeInTheDocument();
  });

  it('11. The tooltip container has role="tooltip"', () => {
    render(<ChartTooltip active={true} payload={[{ value: 10 }]} label="Test Label" />);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
