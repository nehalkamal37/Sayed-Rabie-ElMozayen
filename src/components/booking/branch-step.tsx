import { useState, type FormEvent } from "react";
import { branchesInRegion, regionIds, regionNames, type BranchId } from "@/data/branches";
import type { Locale } from "@/i18n/config";
import type { BookingCopy } from "./booking-flow";
import styles from "./booking-flow.module.css";
import { OptionGroup } from "./option-group";

interface Props {
  readonly locale: Locale;
  readonly copy: BookingCopy;
  readonly selected: BranchId | null;
  readonly onSelect: (id: BranchId) => void;
  readonly onContinue: () => void;
}

export function BranchStep({ locale, copy, selected, onSelect, onContinue }: Props) {
  const [attempted, setAttempted] = useState(false);
  const invalid = attempted && !selected;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected) return onContinue();
    setAttempted(true);
    event.currentTarget.querySelector<HTMLInputElement>("input[type=radio]")?.focus();
  }

  const sections = regionIds.map((region) => ({
    key: region,
    title: regionNames[region][locale],
    options: branchesInRegion(region).map((branch) => ({
      id: branch.id,
      label: branch.name[locale],
      hint: branch.note?.[locale] ?? branch.area?.[locale],
    })),
  }));

  return (
    <form noValidate onSubmit={submit}>
      <OptionGroup
        name="branch"
        labelledBy="step-heading"
        sections={sections}
        selected={selected}
        onSelect={onSelect}
        errorId={invalid ? "branch-error" : undefined}
      />
      <div role="alert">
        {invalid ? (
          <p id="branch-error" className={styles.error}>
            {copy.errors.branch}
          </p>
        ) : null}
      </div>
      <div className={styles.actions}>
        <button type="submit" className="button button--dark">
          {copy.continue}
        </button>
      </div>
    </form>
  );
}
