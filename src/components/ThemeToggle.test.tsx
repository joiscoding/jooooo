import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('calls onChange when a segment is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ThemeToggle preference="system" onChange={onChange} />,
    );
    await user.click(screen.getByRole('radio', { name: 'Light' }));
    expect(onChange).toHaveBeenCalledWith('light');
  });
});
