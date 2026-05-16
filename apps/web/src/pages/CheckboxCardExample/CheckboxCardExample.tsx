import { useState } from "react";

import { CheckboxCard, CheckedState } from "@primitiv/react";

import "./CheckboxCardExample.scss";

export function CheckboxCardExample() {
  const [darkMode, setDarkMode] = useState<CheckedState>(false);

  return (
    <div className="cc-example">
      <h2 className="cc-example__title">CheckboxCard</h2>

      <section className="cc-example__section">
        <h3 className="cc-example__section-title">Uncontrolled</h3>
        <p className="cc-example__description">
          Click a card to toggle. State is owned by each component.
        </p>
        <div className="cc-example__row">
          <CheckboxCard.Root
            className="cc-card"
            aria-label="Enable analytics"
            defaultChecked
          >
            <span className="cc-card__header">
              <span className="cc-card__icon">📊</span>
              <CheckboxCard.Indicator className="cc-card__indicator">
                ✓
              </CheckboxCard.Indicator>
            </span>
            <span className="cc-card__label">Analytics</span>
            <span className="cc-card__description">Track usage metrics</span>
          </CheckboxCard.Root>

          <CheckboxCard.Root className="cc-card" aria-label="Enable notifications">
            <span className="cc-card__header">
              <span className="cc-card__icon">🔔</span>
              <CheckboxCard.Indicator className="cc-card__indicator">
                ✓
              </CheckboxCard.Indicator>
            </span>
            <span className="cc-card__label">Notifications</span>
            <span className="cc-card__description">Receive email alerts</span>
          </CheckboxCard.Root>

          <CheckboxCard.Root className="cc-card" aria-label="Enable backups">
            <span className="cc-card__header">
              <span className="cc-card__icon">💾</span>
              <CheckboxCard.Indicator className="cc-card__indicator">
                ✓
              </CheckboxCard.Indicator>
            </span>
            <span className="cc-card__label">Backups</span>
            <span className="cc-card__description">Auto-save snapshots</span>
          </CheckboxCard.Root>
        </div>
      </section>

      <section className="cc-example__section">
        <h3 className="cc-example__section-title">Controlled</h3>
        <p className="cc-example__description">
          State is owned by the parent.{" "}
          <span className="cc-example__value">
            Dark mode is{" "}
            <strong>{darkMode === true ? "on" : "off"}</strong>.
          </span>
        </p>
        <CheckboxCard.Root
          className="cc-card"
          aria-label="Enable dark mode"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        >
          <span className="cc-card__header">
            <span className="cc-card__icon">🌙</span>
            <CheckboxCard.Indicator className="cc-card__indicator">
              ✓
            </CheckboxCard.Indicator>
          </span>
          <span className="cc-card__label">Dark mode</span>
          <span className="cc-card__description">
            Switch to a dark colour scheme
          </span>
        </CheckboxCard.Root>
      </section>

      <section className="cc-example__section">
        <h3 className="cc-example__section-title">Indeterminate</h3>
        <p className="cc-example__description">
          Starts in the indeterminate ("mixed") state. Click to resolve to
          checked, then toggle normally.
        </p>
        <CheckboxCard.Root
          className="cc-card"
          aria-label="Select all features"
          defaultChecked="indeterminate"
        >
          <span className="cc-card__header">
            <span className="cc-card__icon">✦</span>
            <CheckboxCard.Indicator className="cc-card__indicator">
              ✓
            </CheckboxCard.Indicator>
          </span>
          <span className="cc-card__label">All features</span>
          <span className="cc-card__description">Some features selected</span>
        </CheckboxCard.Root>
      </section>

      <section className="cc-example__section">
        <h3 className="cc-example__section-title">Disabled</h3>
        <div className="cc-example__row">
          <CheckboxCard.Root
            className="cc-card"
            aria-label="Enable feature (off, disabled)"
            disabled
          >
            <span className="cc-card__header">
              <span className="cc-card__icon">🔒</span>
              <CheckboxCard.Indicator className="cc-card__indicator">
                ✓
              </CheckboxCard.Indicator>
            </span>
            <span className="cc-card__label">Locked feature</span>
            <span className="cc-card__description">Not available on your plan</span>
          </CheckboxCard.Root>

          <CheckboxCard.Root
            className="cc-card"
            aria-label="Enable feature (on, disabled)"
            defaultChecked
            disabled
          >
            <span className="cc-card__header">
              <span className="cc-card__icon">🔒</span>
              <CheckboxCard.Indicator className="cc-card__indicator">
                ✓
              </CheckboxCard.Indicator>
            </span>
            <span className="cc-card__label">Required feature</span>
            <span className="cc-card__description">Always enabled</span>
          </CheckboxCard.Root>
        </div>
      </section>
    </div>
  );
}
