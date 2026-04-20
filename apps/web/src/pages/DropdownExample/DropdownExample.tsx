import { Dropdown } from "@primitiv/components";

import "./DropdownExample.scss";

export function DropdownExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>Options</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={() => console.log("Rename selected.")}>
          Rename
        </Dropdown.Item>
        <Dropdown.Item onSelect={() => console.log("Duplicate selected.")}>
          Duplicate
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item disabled>Archive</Dropdown.Item>
      </Dropdown.Content>
      <Dropdown.Content>
        <Dropdown.Item>New</Dropdown.Item>
        <Dropdown.Sub>
          <Dropdown.SubTrigger>Open Recent</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item>Project A</Dropdown.Item>
            <Dropdown.Item>Project B</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
