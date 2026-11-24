"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content";
import { parseBranchId, type BranchId } from "@/data/branches";
import { parseServiceId, type ServiceId } from "@/data/services";
import type { Locale } from "@/i18n/config";
import { validateDetails, type BookingRequest } from "@/lib/booking";
import { updateDraft, useBookingDraft } from "@/lib/booking-draft";
import { fill } from "@/lib/text";
import styles from "./booking-flow.module.css";
import { BranchStep } from "./branch-step";
import { DetailsStep } from "./details-step";
import { ReviewStep } from "./review-step";
import { ServiceStep } from "./service-step";

export type BookingCopy = Dictionary["booking"];
type Step = "branch" | "service" | "details" | "review";

const stepNumber: Record<Step, number> = { branch: 1, service: 2, details: 3, review: 3 };
const progressSteps = ["branch", "service", "details"] as const;

function parseStep(value: string | null): Step {
  return value === "service" || value === "details" || value === "review" ? value : "branch";
}

interface Props {
  readonly locale: Locale;
  readonly copy: BookingCopy;
  /** Cairo date and time when the server rendered the page. */
  readonly renderedAt: { readonly date: string; readonly time: string };
}

/**
 * Branch, service and step live in the URL, so links can preselect them, Back
 * works between steps and the language switch keeps its place. Personal details
 * stay in the tab's draft only.
 */
export function BookingFlow({ locale, copy, renderedAt }: Props) {
  const params = useSearchParams();
  const draft = useBookingDraft();

  // The router applies URL changes in a transition, so a fresh choice is held
  // here to keep the radio buttons responsive.
  const [picked, setPicked] = useState<{ branch?: BranchId; service?: ServiceId }>({});

  const branch =
    picked.branch ?? parseBranchId(params.get("branch")) ?? parseBranchId(draft.branch);
  const service =
    picked.service ?? parseServiceId(params.get("service")) ?? parseServiceId(draft.service);
  const request: BookingRequest | null = branch && service ? { ...draft, branch, service } : null;

  // Never show a step whose earlier answers are missing.
  let step = parseStep(params.get("step"));
  if (step === "review" && Object.keys(validateDetails(draft, renderedAt)).length > 0) step = "details";
  if ((step === "details" || step === "review") && !service) step = "service";
  if (step !== "branch" && !branch) step = "branch";

  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    heading.current?.focus();
  }, [step]);

  function setUrl(patch: Record<string, string>, mode: "push" | "replace") {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(patch)) next.set(key, value);
    const url = `?${next}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  }

  function goTo(target: Step) {
    setUrl(
      { ...(branch ? { branch } : {}), ...(service ? { service } : {}), step: target },
      "push",
    );
  }

  const headings: Record<Step, string> = {
    branch: copy.branchHeading,
    service: copy.serviceHeading,
    details: copy.detailsHeading,
    review: copy.reviewHeading,
  };
  const current = stepNumber[step];

  return (
    <div>
      <ol className={styles.progress} aria-label={copy.progressLabel}>
        {progressSteps.map((name, index) => {
          const number = index + 1;
          const done = number < current || step === "review";
          return (
            <li
              key={name}
              data-state={done ? "done" : number === current ? "current" : "next"}
              aria-current={number === current ? "step" : undefined}
            >
              <span className={styles.stepNumber} aria-hidden="true">
                {number}
              </span>
              {copy.steps[name]}
              {done ? <span className="visually-hidden"> ({copy.stepDone})</span> : null}
            </li>
          );
        })}
      </ol>

      <section className={styles.panel} aria-labelledby="step-heading">
        <p className={styles.stepOf}>{fill(copy.stepOf, { n: current })}</p>
        <h2 id="step-heading" ref={heading} tabIndex={-1} className={styles.stepHeading}>
          {headings[step]}
        </h2>

        {step === "branch" ? (
          <BranchStep
            locale={locale}
            copy={copy}
            selected={branch}
            onSelect={(id) => {
              setPicked({ ...picked, branch: id });
              updateDraft({ branch: id });
              setUrl({ branch: id }, "replace");
            }}
            onContinue={() => goTo("service")}
          />
        ) : null}

        {step === "service" ? (
          <ServiceStep
            locale={locale}
            copy={copy}
            selected={service}
            onSelect={(id) => {
              setPicked({ ...picked, service: id });
              updateDraft({ service: id });
              setUrl({ service: id }, "replace");
            }}
            onBack={() => goTo("branch")}
            onContinue={() => goTo("details")}
          />
        ) : null}

        {step === "details" ? (
          <DetailsStep
            locale={locale}
            copy={copy}
            details={draft}
            today={renderedAt.date}
            onChange={updateDraft}
            onBack={() => goTo("service")}
            onContinue={() => goTo("review")}
          />
        ) : null}

        {step === "review" && request ? (
          <ReviewStep
            locale={locale}
            copy={copy}
            request={request}
            onEdit={(field) =>
              goTo(field === "branch" || field === "service" ? field : "details")
            }
            onBack={() => goTo("details")}
          />
        ) : null}
      </section>
    </div>
  );
}
