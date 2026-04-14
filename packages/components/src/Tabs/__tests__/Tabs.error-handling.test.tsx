import { render, screen } from '@testing-library/react';
import { act, useState } from 'react';

import { Tabs } from '..';

import { errorCases } from './Tabs.fixtures';

describe('Error Handling', () => {
  it.each(errorCases)('should throw error when $name is not a valid tab', ({ rootProps }) => {
    // Arrange & Assert
    const exampleIncorrectValue = rootProps.value || rootProps.defaultValue;
    expect(() =>
      render(
        <Tabs.Root {...rootProps}>
          <Tabs.List label="Test label">
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Panel 1</Tabs.Content>
          <Tabs.Content value="tab2">Panel 2</Tabs.Content>
        </Tabs.Root>,
      ),
    ).toThrow(
      `Invalid active tab value: "${exampleIncorrectValue}". Valid values are: [tab1, tab2]`,
    );
  });

  it('should throw error when value prop changes to an invalid tab (controlled mode only)', () => {
    // Arrange
    const exampleIncorrectValue = 'nonexistent';
    function ControlledTabs() {
      const [tab, setTab] = useState('tab1');
      return (
        <>
          <button type="button" onClick={() => setTab(exampleIncorrectValue)}>
            Set Invalid Tab
          </button>
          <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List label="Test label">
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Panel 1</Tabs.Content>
            <Tabs.Content value="tab2">Panel 2</Tabs.Content>
          </Tabs.Root>
        </>
      );
    }
    render(<ControlledTabs />);

    // Act & Assert
    expect(() => {
      act(() => {
        screen.getByText('Set Invalid Tab').click();
      });
    }).toThrow(
      `Invalid active tab value: "${exampleIncorrectValue}". Valid values are: [tab1, tab2]`,
    );
  });
});
