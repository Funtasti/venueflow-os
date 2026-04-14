import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies danger variant styling properly via class', () => {
    const { container } = render(<Button variant="danger">Emergency</Button>);
    expect(container.firstChild).toHaveClass('danger');
  });

  it('is accessible via keyboard focus', () => {
    render(<Button>Focus Me</Button>);
    const btn = screen.getByText('Focus Me');
    btn.focus();
    expect(btn).toHaveFocus();
  });
});
