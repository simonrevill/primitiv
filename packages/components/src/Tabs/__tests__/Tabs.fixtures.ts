import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const arrowKeyCases = [
  {
    description: 'Horizontal: Right Arrow moves to next tab',
    orientation: 'horizontal',
    defaultValue: 'tab1',
    key: '{ArrowRight}',
    expectedTab: 'Tab 2',
    expectedDeselected: ['Tab 1', 'Tab 3'],
  },
  {
    description: 'Horizontal: Left Arrow moves to previous tab',
    orientation: 'horizontal',
    defaultValue: 'tab2',
    key: '{ArrowLeft}',
    expectedTab: 'Tab 1',
    expectedDeselected: ['Tab 2', 'Tab 3'],
  },
  {
    description: 'Horizontal: Left Arrow wraps to last tab from first',
    orientation: 'horizontal',
    defaultValue: 'tab1',
    key: '{ArrowLeft}',
    expectedTab: 'Tab 3',
    expectedDeselected: ['Tab 1', 'Tab 2'],
  },
  {
    description: 'Horizontal: Right Arrow wraps to first tab from last',
    orientation: 'horizontal',
    defaultValue: 'tab3',
    key: '{ArrowRight}',
    expectedTab: 'Tab 1',
    expectedDeselected: ['Tab 2', 'Tab 3'],
  },
  {
    description: 'Vertical: Down Arrow moves to next tab',
    orientation: 'vertical',
    defaultValue: 'tab1',
    key: '{ArrowDown}',
    expectedTab: 'Tab 2',
    expectedDeselected: ['Tab 1', 'Tab 3'],
  },
  {
    description: 'Vertical: Up Arrow moves to previous tab',
    orientation: 'vertical',
    defaultValue: 'tab2',
    key: '{ArrowUp}',
    expectedTab: 'Tab 1',
    expectedDeselected: ['Tab 2', 'Tab 3'],
  },
  {
    description: 'Vertical: Up Arrow wraps to last tab from first',
    orientation: 'vertical',
    defaultValue: 'tab1',
    key: '{ArrowUp}',
    expectedTab: 'Tab 3',
    expectedDeselected: ['Tab 1', 'Tab 2'],
  },
  {
    description: 'Vertical: Down Arrow wraps to first tab from last',
    orientation: 'vertical',
    defaultValue: 'tab3',
    key: '{ArrowDown}',
    expectedTab: 'Tab 1',
    expectedDeselected: ['Tab 2', 'Tab 3'],
  },
] as const;

export const mouseChangeEventCases = [
  {
    name: 'mouse click',
    interact: async (tab: HTMLElement, user: ReturnType<typeof userEvent.setup>) => {
      await user.click(tab);
    },
    getTab: () => screen.getByRole('tab', { name: 'Tab 2' }),
    expected: { index: 1, name: 'tab2' },
  },
];

export const keyboardChangeEventCases = [
  {
    name: 'keyboard navigation (ArrowRight)',
    defaultValue: 'tab1',
    interact: async (user: ReturnType<typeof userEvent.setup>) => {
      await user.tab(); // focus first tab
      await user.keyboard('{ArrowRight}');
    },
    getTab: () => screen.getByRole('tab', { name: 'Tab 2' }),
    expected: { index: 1, name: 'tab2' },
  },
  {
    name: 'keyboard navigation (Home)',
    defaultValue: 'tab2', // Start on tab2 so Home changes to tab1
    interact: async (user: ReturnType<typeof userEvent.setup>) => {
      await user.tab();
      await user.keyboard('{Home}');
    },
    getTab: () => screen.getByRole('tab', { name: 'Tab 1' }),
    expected: { index: 0, name: 'tab1' },
  },
  {
    name: 'keyboard navigation (End)',
    defaultValue: 'tab1',
    interact: async (user: ReturnType<typeof userEvent.setup>) => {
      await user.tab();
      await user.keyboard('{End}');
    },
    getTab: () => screen.getByRole('tab', { name: 'Tab 3' }),
    expected: { index: 2, name: 'tab3' },
  },
];

export const errorCases = [
  {
    name: 'controlled (value)',
    rootProps: { value: 'nonexistent', onValueChange: vi.fn() },
  },
  {
    name: 'uncontrolled (defaultValue)',
    rootProps: { defaultValue: 'nonexistent' },
  },
];
