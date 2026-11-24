/**
 * Operational facts stay `pending` until the client approves them. Pending items
 * carry no value, so an unapproved address, number or link cannot be rendered.
 */
export type Verifiable<T> =
  | { readonly status: "verified"; readonly value: T }
  | { readonly status: "pending" };

export const pending = { status: "pending" } as const;

export function verified<T>(value: T): Verifiable<T> {
  return { status: "verified", value };
}
