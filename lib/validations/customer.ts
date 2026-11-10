import { z } from "zod"

/** A Zoho customer id as it travels in a URL segment or an action argument. */
export const zohoCustomerIdSchema = z.string().trim().min(1).max(64)
