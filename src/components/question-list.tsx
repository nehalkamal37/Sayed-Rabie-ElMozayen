import { Icon } from "./icons";
import styles from "./question-list.module.css";

export interface QuestionItem {
  readonly question: string;
  /** Absent until the client supplies it. */
  readonly answer?: string;
  readonly tip?: string;
}

interface Props {
  readonly items: readonly QuestionItem[];
  readonly pendingLabel: string;
  /** Matches the approved branch page, where desktop questions sit on a beige band. */
  readonly onBeige?: boolean;
}

export function QuestionList({ items, pendingLabel, onBeige = false }: Props) {
  return (
    <div className={styles.list} data-on-beige={onBeige || undefined}>
      {items.map(({ question, answer, tip }) => (
        <details key={question}>
          <summary>
            <h3>{question}</h3>
            <Icon name="chevronDown" size={18} className={styles.chevron} />
          </summary>
          <p className={answer ? undefined : styles.pending}>{answer ?? pendingLabel}</p>
          {tip ? <p>{tip}</p> : null}
        </details>
      ))}
    </div>
  );
}
