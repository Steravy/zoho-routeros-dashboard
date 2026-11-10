import { z } from "zod"

import {
  ACTIONS,
  CUSTOMER_TABS,
  DEFAULT_CUSTOMER_TAB,
  DEFAULT_GRANULARITY,
  DEFAULT_TOP_LIMIT,
  DEFAULT_TOP_PERIOD,
  DEFAULT_WINDOW,
  DRIFT_BUCKETS,
  FAILURE_CODES,
  GRANULARITIES,
  NEEDS_HUMAN_CODES,
  SOURCES,
  TOP_LIMITS,
  TOP_PERIODS,
  WINDOWS,
} from "@/lib/constants"
import type {
  CustomerPageQuery,
  CustomerSearchQuery,
  CursorQuery,
  DriftQuery,
  FailuresQuery,
  NeedsHumanQuery,
  TopConsumersQuery,
  UsageQuery,
  WindowQuery,
} from "@/types/query"

/*
 * These parse raw `searchParams`. Every field falls back to its default on a bad
 * value instead of failing: the API silently ignores unknown params and a typo'd
 * filter should never take a page down.
 */

const windowField = z.enum(WINDOWS).catch(DEFAULT_WINDOW)
const cursorField = z.string().min(1).optional().catch(undefined)

function optionalEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return z.enum(values).optional().catch(undefined)
}

export const windowQuerySchema = z.object({
  window: windowField,
}) satisfies z.ZodType<WindowQuery>

export const cursorQuerySchema = z.object({
  cursor: cursorField,
}) satisfies z.ZodType<CursorQuery>

export const failuresQuerySchema = z.object({
  window: windowField,
  failureCode: optionalEnum(FAILURE_CODES),
  action: optionalEnum(ACTIONS),
  source: optionalEnum(SOURCES),
  q: z.string().trim().min(1).max(120).optional().catch(undefined),
  cursor: cursorField,
}) satisfies z.ZodType<FailuresQuery>

export const needsHumanQuerySchema = z.object({
  window: windowField,
  code: z.enum(NEEDS_HUMAN_CODES).catch(NEEDS_HUMAN_CODES[0]),
  cursor: cursorField,
}) satisfies z.ZodType<NeedsHumanQuery>

export const driftQuerySchema = z.object({
  bucket: z.enum(DRIFT_BUCKETS).catch(DRIFT_BUCKETS[0]),
  cursor: cursorField,
}) satisfies z.ZodType<DriftQuery>

export const customerSearchQuerySchema = z.object({
  q: z.string().trim().min(2).max(120).optional().catch(undefined),
  cursor: cursorField,
}) satisfies z.ZodType<CustomerSearchQuery>

/* ── Usage ── */

// Calendar dates only; whether the pair makes a usable range is `lib/usage/range.ts`'s call.
const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined)

const usageFields = {
  g: z.enum(GRANULARITIES).catch(DEFAULT_GRANULARITY),
  // Preset keys differ per granularity; an unknown one resolves to that granularity's default.
  range: z.string().max(8).optional().catch(undefined),
  from: dateField,
  to: dateField,
}

export const usageQuerySchema = z.object(usageFields) satisfies z.ZodType<UsageQuery>

export const customerPageQuerySchema = z.object({
  ...usageFields,
  tab: z.enum(CUSTOMER_TABS).catch(DEFAULT_CUSTOMER_TAB),
  line: z.string().trim().min(1).max(120).optional().catch(undefined),
  cursor: cursorField,
}) satisfies z.ZodType<CustomerPageQuery>

export const topConsumersQuerySchema = z.object({
  top: z.enum(TOP_PERIODS).catch(DEFAULT_TOP_PERIOD),
  topFrom: dateField,
  topTo: dateField,
  limit: z.coerce
    .number()
    .pipe(z.union(TOP_LIMITS.map((limit) => z.literal(limit))))
    .catch(DEFAULT_TOP_LIMIT),
}) satisfies z.ZodType<TopConsumersQuery>
