import type { BranchId } from "@/data/branches";
import type { ServiceId } from "@/data/services";

/** Choices carried into a booking when it opens from a branch or service. */
export interface BookingPreset {
  readonly branch?: BranchId;
  readonly service?: ServiceId;
}

/** Language-neutral booking path with optional preselection. */
export function bookingPath(query: BookingPreset = {}): string {
  const params = new URLSearchParams();
  if (query.branch) params.set("branch", query.branch);
  if (query.service) params.set("service", query.service);
  const search = params.toString();
  return search ? `/book?${search}` : "/book";
}
