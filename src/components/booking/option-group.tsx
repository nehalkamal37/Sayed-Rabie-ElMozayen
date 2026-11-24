import styles from "./option-group.module.css";

export interface Option<Id extends string> {
  readonly id: Id;
  readonly label: string;
  readonly hint?: string;
}

export interface OptionSection<Id extends string> {
  readonly key: string;
  readonly title: string;
  readonly options: readonly Option<Id>[];
}

interface Props<Id extends string> {
  readonly name: string;
  /** Names the whole radio group. */
  readonly labelledBy: string;
  readonly sections: readonly OptionSection<Id>[];
  readonly selected: Id | null;
  readonly onSelect: (id: Id) => void;
  /** Id of the error message while the group is invalid. */
  readonly errorId?: string;
}

export function OptionGroup<Id extends string>({
  name,
  labelledBy,
  sections,
  selected,
  onSelect,
  errorId,
}: Props<Id>) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-required="true"
      aria-invalid={errorId ? true : undefined}
      aria-describedby={errorId}
      className={styles.group}
    >
      {sections.map((section) => (
        <div key={section.key}>
          <p className={styles.title} id={`${name}-${section.key}`}>
            {section.title}
          </p>
          <div className={styles.options}>
            {section.options.map((option) => (
              <label key={option.id} className={styles.option}>
                <input
                  type="radio"
                  name={name}
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => onSelect(option.id)}
                />
                <span>
                  <span className={styles.label}>{option.label}</span>
                  {option.hint ? <span className={styles.hint}>{option.hint}</span> : null}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
