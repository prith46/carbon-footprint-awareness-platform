import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import QuickActions from '../components/QuickActions';
import { quickActionsDB } from '../data/quickActions';

describe('QuickActions', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('1. Renders nothing when checkedActions is undefined', () => {
    const { container } = render(<QuickActions highestCategoryName="transport" checkedActions={undefined} onCheck={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('2. Renders nothing when checkedActions is not a Set', () => {
    const { container } = render(<QuickActions highestCategoryName="transport" checkedActions={[]} onCheck={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('3. Renders actions for the correct category when highestCategoryName is provided', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="transport" checkedActions={checkedActions} onCheck={() => {}} />);
    expect(screen.getByText('Take public transit instead of driving')).toBeInTheDocument();
  });

  it('4. Falls back to generic actions when highestCategoryName is unknown', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="unknown" checkedActions={checkedActions} onCheck={() => {}} />);
    expect(screen.getByText('Turn off lights in empty rooms')).toBeInTheDocument();
  });

  it('5. Renders the correct number of action items', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="transport" checkedActions={checkedActions} onCheck={() => {}} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(quickActionsDB.transport.length);
  });

  it('6. Unchecked action shows action text without line-through', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={() => {}} />);
    const actionText = screen.getByText('Turn off lights in empty rooms');
    expect(actionText).not.toHaveClass('line-through');
  });

  it('7. Checked action shows action text with line-through and reduced opacity', () => {
    const checkedActions = new Set(['g1']);
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={() => {}} />);
    const actionText = screen.getByText('Turn off lights in empty rooms');
    expect(actionText).toHaveClass('line-through');
    expect(actionText).toHaveClass('opacity-70');
  });

  it('8. Checked action shows sr-only "(completed for today)" text', () => {
    const checkedActions = new Set(['g1']);
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={() => {}} />);
    expect(screen.getByText('(completed for today)')).toBeInTheDocument();
  });

  it('9. Unchecked action does not show sr-only completion text', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={() => {}} />);
    expect(screen.queryByText('(completed for today)')).not.toBeInTheDocument();
  });

  it('10. Clicking a checkbox calls onCheck with the correct action id', () => {
    const checkedActions = new Set();
    const onCheckMock = vi.fn();
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={onCheckMock} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(onCheckMock).toHaveBeenCalledWith('g1');
  });

  it('11. Actions grid has role="group"', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={() => {}} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('12. Actions grid has aria-labelledby pointing to the heading id', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={() => {}} />);
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-labelledby', 'quick-actions-heading');
  });

  it('13. Heading has the correct id', () => {
    const checkedActions = new Set();
    render(<QuickActions highestCategoryName="generic" checkedActions={checkedActions} onCheck={() => {}} />);
    const heading = screen.getByText('Quick Actions for Today');
    expect(heading).toHaveAttribute('id', 'quick-actions-heading');
  });
});
