import { Accordion } from "@primitiv/components";
import "./AccordionExample.scss";
export function AccordionExample() {
  return (
    <Accordion.Root defaultValue="shipping" className="accordion">
      <Accordion.Item value="shipping" className="accordion__item">
        <Accordion.Header className="accordion__header">
          <Accordion.Trigger className="accordion__trigger">
            Shipping policy
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="accordion__content">
          Free on orders over £50.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns" className="accordion__item">
        <Accordion.Header className="accordion__header">
          <Accordion.Trigger className="accordion__trigger">
            Returns
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="accordion__content">
          30-day returns accepted.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
