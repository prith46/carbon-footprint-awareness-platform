import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import * as ProfileContext from '../context/ProfileContext';

vi.mock('../context/ProfileContext', () => ({
  useUserProfile: vi.fn()
}));

describe('Navbar', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const renderWithRouter = (ui, initialEntries = ['/']) => {
    return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
  };

  it('1. Renders the CarbonTrace brand link', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    expect(screen.getByText('CarbonTrace')).toBeInTheDocument();
  });

  it('2. Desktop nav links are not shown when profile.onboarded is false (except Home)', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: false } });
    renderWithRouter(<Navbar />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Log')).not.toBeInTheDocument();
    expect(screen.queryByText('Insights')).not.toBeInTheDocument();
    expect(screen.queryByText('Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Learn')).not.toBeInTheDocument();
    
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('3. Desktop nav links are shown when profile.onboarded is true', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Log').length).toBeGreaterThan(0);
  });

  it('4. Mobile menu is hidden by default', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    const { container } = renderWithRouter(<Navbar />);
    expect(container.querySelector('#mobile-menu')).not.toBeInTheDocument();
  });

  it('5. Clicking the hamburger button opens the mobile menu', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    const { container } = renderWithRouter(<Navbar />);
    const toggleBtn = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleBtn);
    expect(container.querySelector('#mobile-menu')).toBeInTheDocument();
  });

  it('6. Clicking a mobile nav link closes the mobile menu', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    const { container } = renderWithRouter(<Navbar />);
    const toggleBtn = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleBtn);
    expect(container.querySelector('#mobile-menu')).toBeInTheDocument();
    
    const mobileMenu = container.querySelector('#mobile-menu');
    const homeLink = within(mobileMenu).getByText('Home').closest('a');
    fireEvent.click(homeLink);
    
    expect(container.querySelector('#mobile-menu')).not.toBeInTheDocument();
  });

  it('7. Active link has aria-current="page" in desktop nav', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />, ['/dashboard']);
    const dashboardLinks = screen.getAllByText('Dashboard');
    const desktopLink = dashboardLinks[0].closest('a');
    expect(desktopLink).toHaveAttribute('aria-current', 'page');
  });

  it('8. Active link has aria-current="page" in mobile nav', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    const { container } = renderWithRouter(<Navbar />, ['/dashboard']);
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    const mobileMenu = container.querySelector('#mobile-menu');
    const mobileDashboardLink = within(mobileMenu).getByText('Dashboard').closest('a');
    expect(mobileDashboardLink).toHaveAttribute('aria-current', 'page');
  });

  it('9. Hamburger button has aria-expanded=false when menu is closed', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    const toggleBtn = screen.getByLabelText('Toggle menu');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('10. Hamburger button has aria-expanded=true when menu is open', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    const toggleBtn = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('11. Hamburger button has aria-controls="mobile-menu"', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    const toggleBtn = screen.getByLabelText('Toggle menu');
    expect(toggleBtn).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('12. Mobile menu dropdown has id="mobile-menu"', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    const { container } = renderWithRouter(<Navbar />);
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(container.querySelector('#mobile-menu')).toBeInTheDocument();
  });

  it('13. Skip to content link is present in the DOM', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });

  it('14. <nav> element has aria-label="Main navigation"', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('15. Non-active links do NOT have aria-current', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />, ['/dashboard']);
    const homeLinks = screen.getAllByText('Home');
    const desktopHomeLink = homeLinks[0].closest('a');
    expect(desktopHomeLink).not.toHaveAttribute('aria-current');
  });

  it('17. Focus returns to hamburger button after closing mobile menu', () => {
    ProfileContext.useUserProfile.mockReturnValue({ profile: { onboarded: true } });
    renderWithRouter(<Navbar />);
    const toggleBtn = screen.getByLabelText('Toggle menu');
    
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('navigation').querySelector('#mobile-menu')).toBeInTheDocument();
    
    fireEvent.click(toggleBtn); // Close menu
    expect(screen.getByRole('navigation').querySelector('#mobile-menu')).not.toBeInTheDocument();
    expect(toggleBtn).toHaveFocus();
  });
});
