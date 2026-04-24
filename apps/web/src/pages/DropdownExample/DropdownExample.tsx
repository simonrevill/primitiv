import { Dropdown } from "@primitiv/components";

import "./DropdownExample.scss";

export function DropdownExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="dd-trigger">Options</Dropdown.Trigger>
      <Dropdown.Content className="dd-content">
        <Dropdown.Item onSelect={() => console.log("Rename selected.")}>
          Rename
        </Dropdown.Item>
        <Dropdown.Item onSelect={() => console.log("Duplicate selected.")}>
          Duplicate
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item disabled>Archive</Dropdown.Item>
        <Dropdown.Item>New</Dropdown.Item>
        <Dropdown.Sub>
          <Dropdown.SubTrigger className="dd-sub-trigger">
            Open Recent
            <span aria-hidden="true">{">"}</span>
          </Dropdown.SubTrigger>
          <Dropdown.SubContent className="dd-sub-content">
            <Dropdown.Item>Project A</Dropdown.Item>

            <Dropdown.Sub>
              <Dropdown.SubTrigger className="dd-sub-trigger">
                Project B<span aria-hidden="true">{">"}</span>
              </Dropdown.SubTrigger>
              <Dropdown.SubContent className="dd-sub-content">
                <Dropdown.Item>Example 1</Dropdown.Item>
                <Dropdown.Item>Example 2</Dropdown.Item>
              </Dropdown.SubContent>
            </Dropdown.Sub>
          </Dropdown.SubContent>
        </Dropdown.Sub>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
