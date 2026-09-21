import { createElement } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../theme/types';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return createElement(
    'div',
    {
      className: 'theme-toggle',
      role: 'group',
      'aria-label': 'Color theme',
    },
    OPTIONS.map(({ value, label }) =>
      createElement(
        'button',
        {
          key: value,
          type: 'button',
          className:
            theme === value ? 'theme-toggle-btn active' : 'theme-toggle-btn'
          ,
          'aria-pressed': theme === value,
          'aria-label': `${label} theme`,
          onClick: () => setTheme(value),
        },
        label,
      ),
    ),
  );
}
