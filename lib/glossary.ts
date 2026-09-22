/** The words operators meet in field names and error messages (API contract §1). */
export const GLOSSARY: { term: string; meaning: string }[] = [
  {
    term: "PPPoE secret",
    meaning:
      "The router's stored credential for one customer: name, password, profile, disabled flag, comment. \"The secret\" and \"the customer's line\" are the same thing.",
  },
  {
    term: "Profile",
    meaning: "The bandwidth/service plan attached to a secret, e.g. 10mbps.",
  },
  {
    term: "Disabled flag",
    meaning:
      "RouterOS's on/off switch for a credential. Used only for a brand-new customer who has not paid yet. It is not how suspension works.",
  },
  {
    term: "Blocked profile",
    meaning:
      "Suspension is a profile switch: a non-paying customer's secret moves to BLOQUEIO, a real throttled profile. They still connect, just slowly. Their real plan is saved and restored when they pay.",
  },
  {
    term: "Twin contracts",
    meaning:
      "One person holding several contracts. The extra secrets are named by appending 0 or 00 to the base username. A secret already claimed by a different Zoho id is a twin's line — never take it.",
  },
  {
    term: "Probe ladder",
    meaning:
      "How the bridge guesses a username with no stored mapping: lowercase first word of the first name + the 7 local phone digits, for every phone on the payload, then the same names with 0 and 00 appended. First unclaimed hit wins.",
  },
  {
    term: "Dry-run",
    meaning:
      "A safety mode. When on, every router write is emailed to the owner instead of executed, and email subjects are prefixed [DRY-RUN]. Reads are unaffected — this dashboard shows real data either way.",
  },
  {
    term: "Zoho customer id",
    meaning: "The customer's primary key everywhere in this API. A string.",
  },
  {
    term: "Replay queue",
    meaning:
      "Events that arrived while the router was unreachable. Zoho was already told 200 OK, so they cannot be re-requested; the bridge replays them when the link returns and gives up after 50 attempts or 72 hours.",
  },
  {
    term: "Drift",
    meaning:
      "Where the router and the mapping table disagree: orphans (secrets nothing claims), missing (mappings pointing at gone secrets) and ambiguous (one username claimed by several Zoho ids).",
  },
]
