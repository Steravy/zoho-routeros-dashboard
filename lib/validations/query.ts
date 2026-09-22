import { z } from "zod"

import {
  ACTIONS,
  DEFAULT_WINDOW,
  DRIFT_BUCKETS,
  FAILURE_CODES,
  NEEDS_HUMAN_CODES,
  SOURCES,
  WINDOWS,
} from "@/lib/constants"
import type {
  CustomerSearchQuery,
  CursorQuery,
  DriftQuery,
  FailuresQuery,
  NeedsHumanQuery,
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
