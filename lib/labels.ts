import type {
  ActionOutcome,
  ActionType,
  DriftBucket,
  EventGroup,
  FailureCode,
  Granularity,
  OutageEndReason,
  PendingStatus,
  ProfileKind,
  SuggestionSource,
  TimeWindow,
  TriggerSource,
} from "@/types/ops"
import type {
  BadgeVariant,
  CustomerTab,
  ProfileTone,
  TopPeriod,
} from "@/types/ui"

export const WINDOW_LABELS: Record<TimeWindow, string> = {
  "24h": "Últimas 24 horas",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
}

export const OUTCOME_LABELS: Record<ActionOutcome, string> = {
  SUCCESS: "Sucesso",
  NOOP: "Sem alteração",
  IGNORED: "Ignorado",
  DEFERRED: "Adiado",
  FAILURE: "Falha",
  UNKNOWN: "Desconhecido",
}

export const OUTCOME_DESCRIPTIONS: Record<ActionOutcome, string> = {
  SUCCESS: "Uma alteração no roteador foi tentada e funcionou",
  NOOP: "Já estava no estado desejado — nada foi gravado",
  IGNORED: "Um evento do Zoho sem mapeamento; ignorado de propósito",
  DEFERRED: "O roteador estava fora do ar; enfileirado para reprocessamento",
  FAILURE: "Algo deu errado — veja o código de falha",
  UNKNOWN: "Gravado por uma versão anterior durante um deploy",
}

export const OUTCOME_BADGE: Record<ActionOutcome, BadgeVariant> = {
  SUCCESS: "default",
  NOOP: "secondary",
  IGNORED: "outline",
  DEFERRED: "secondary",
  FAILURE: "destructive",
  UNKNOWN: "outline",
}

export const FAILURE_CODE_LABELS: Record<FailureCode, string> = {
  NO_USABLE_PHONE: "Sem telefone válido",
  ALL_CANDIDATES_CLAIMED: "Candidatos já vinculados",
  NO_SECRET_FOR_CANDIDATES: "Nenhum secret encontrado",
  PROBE_FAILED: "Sondagem falhou",
  DUPLICATE_SECRET: "Secret duplicado",
  USER_ALREADY_EXISTS: "Usuário já existe",
  SECRET_NOT_FOUND: "Secret não encontrado",
  ROUTEROS_UNAVAILABLE: "Roteador indisponível",
  REPLAY_GAVE_UP: "Tentativas esgotadas",
  QUEUE_WRITE_FAILED: "Evento perdido",
  INVALID_CUSTOM_FIELDS: "Campos inválidos",
  LINE_NOT_FOUND: "Linha não encontrada",
  AMBIGUOUS_LINE: "Linha ambígua",
  UNKNOWN: "Desconhecido",
}

export const FAILURE_CODE_DESCRIPTIONS: Record<FailureCode, string> = {
  NO_USABLE_PHONE: "O Zoho não enviou nenhum telefone que a ponte pudesse usar",
  ALL_CANDIDATES_CLAIMED:
    "Todo secret correspondente pertence a outro cliente (contrato gêmeo)",
  NO_SECRET_FOR_CANDIDATES:
    "Não existe secret com nenhum dos nomes derivados pela ponte",
  PROBE_FAILED: "A própria consulta ao roteador deu erro durante a busca",
  DUPLICATE_SECRET:
    "Já existe um secret com outro número do cliente",
  USER_ALREADY_EXISTS: "Tentou criar um secret que já existe",
  SECRET_NOT_FOUND: "Tentou alterar um secret que não existe",
  ROUTEROS_UNAVAILABLE:
    "O roteador estava inacessível e o evento não pôde ser adiado",
  REPLAY_GAVE_UP: "Ficou 50 tentativas ou 72 horas na fila sem sucesso",
  QUEUE_WRITE_FAILED:
    "O roteador estava fora do ar e o evento não pôde ser enfileirado — este evento se perdeu",
  INVALID_CUSTOM_FIELDS: "Webhook legado: os campos personalizados do Zoho eram inutilizáveis",
  LINE_NOT_FOUND: "Nenhuma linha (contrato ↔ secret) é conhecida para este evento",
  AMBIGUOUS_LINE:
    "O cliente tem várias linhas e a invoice não indicou o contrato — precisa de um humano",
  UNKNOWN: "Não classificado",
}

export const ACTION_LABELS: Record<ActionType, string> = {
  CREATE_USER: "Criar usuário",
  ENABLE_USER: "Habilitar usuário",
  DISABLE_USER: "Desabilitar usuário",
  ACTIVATE_USER: "Ativar",
  BLOCK_USER: "Bloquear",
  DELETE_USER: "Excluir usuário",
  UPDATE_USER: "Atualizar usuário",
  KICK_SESSION: "Derrubar sessão",
  IGNORED: "Ignorado",
}

export const SOURCE_LABELS: Record<TriggerSource, string> = {
  ZOHO: "Webhook do Zoho",
  MANUAL: "API de administração",
}

export const PENDING_STATUS_LABELS: Record<PendingStatus, string> = {
  PENDING: "Pendente",
  REPLAYED: "Reprocessado",
  GAVE_UP: "Desistiu",
}

export const OUTAGE_END_LABELS: Record<OutageEndReason, string> = {
  RESTORED: "Restabelecido",
  ASSUMED_AT_RESTART: "Estimado no reinício",
}

export const DRIFT_BUCKET_LABELS: Record<DriftBucket, string> = {
  orphans: "Órfãos",
  missing: "Ausentes",
  ambiguous: "Ambíguos",
}

export const DRIFT_BUCKET_DESCRIPTIONS: Record<DriftBucket, string> = {
  orphans: "Secrets no roteador que nenhum mapeamento reivindica",
  missing: "Mapeamentos que apontam para um secret que o roteador não tem mais",
  ambiguous: "Um username reivindicado por mais de um id do Zoho (contratos gêmeos)",
}

export const SUGGESTION_SOURCE_LABELS: Record<SuggestionSource, string> = {
  ladder: "Nome sondado",
  "digit-match": "Dígitos iguais",
}

export const SUGGESTION_SOURCE_DESCRIPTIONS: Record<SuggestionSource, string> = {
  ladder: "A ponte sondou exatamente este nome",
  "digit-match":
    "Contém os dígitos do telefone mas não estava na escada — o nome no roteador provavelmente difere do Zoho",
}

export const PROFILE_KIND_LABELS: Record<ProfileKind, string> = {
  plan: "Plano",
  blocked: "Bloqueado",
  other: "Outro",
}

/** The coloured dot beside a profile name — tokens live in `app/globals.css`. */
export const PROFILE_TONE_DOT: Record<ProfileTone, string> = {
  fast: "bg-plan-fast",
  pro: "bg-plan-pro",
  basic: "bg-plan-basic",
  blocked: "bg-destructive",
  other: "bg-profile-other",
}

export const EVENT_GROUP_LABELS: Record<EventGroup, string> = {
  customer: "Cliente",
  recurring_invoice: "Contrato",
  invoice: "Fatura",
}

export const EVENT_GROUP_BADGE: Record<EventGroup, BadgeVariant> = {
  customer: "outline",
  recurring_invoice: "secondary",
  invoice: "secondary",
}

/* ── Usage ── */

export const GRANULARITY_LABELS: Record<Granularity, string> = {
  hour: "Hora",
  day: "Dia",
  week: "Semana",
  month: "Mês",
}

/** "Consumo por …" */
export const GRANULARITY_UNIT_LABELS: Record<Granularity, string> = {
  hour: "hora",
  day: "dia",
  week: "semana",
  month: "mês",
}

/** Keyed by the preset keys of `USAGE_PRESETS`. */
export const USAGE_PRESET_LABELS: Record<string, { short: string; long: string }> = {
  "24h": { short: "24 h", long: "Últimas 24 horas" },
  "48h": { short: "48 h", long: "Últimas 48 horas" },
  "7d": { short: "7 d", long: "Últimos 7 dias" },
  "30d": { short: "30 d", long: "Últimos 30 dias" },
  "90d": { short: "90 d", long: "Últimos 90 dias" },
  "12w": { short: "12 sem", long: "Últimas 12 semanas" },
  "26w": { short: "26 sem", long: "Últimas 26 semanas" },
  "52w": { short: "52 sem", long: "Últimas 52 semanas" },
  "6m": { short: "6 m", long: "Últimos 6 meses" },
  "12m": { short: "12 m", long: "Últimos 12 meses" },
  "24m": { short: "24 m", long: "Últimos 24 meses" },
}

export const TOP_PERIOD_LABELS: Record<TopPeriod, string> = {
  today: "Hoje",
  week: "Esta semana",
  month: "Este mês",
  "30d": "Últimos 30 dias",
  custom: "Personalizado",
}

export const CUSTOMER_TAB_LABELS: Record<CustomerTab, string> = {
  resumo: "Resumo",
  consumo: "Consumo",
  historico: "Histórico",
}

/** Shown wherever usage figures appear — they are not billing-grade. */
export const USAGE_APPROXIMATE_HINT =
  "Aproximado. Registrado a cada 5 minutos; alguns minutos de tráfego podem se perder quando um cliente desconecta."

const TIMEZONE_LABELS: Record<string, string> = {
  "Atlantic/Cape_Verde": "Cabo Verde",
}

/** Human name of the timezone a usage response was bucketed in; an unknown zone shows its IANA id. */
export function timezoneLabel(timeZone: string): string {
  return TIMEZONE_LABELS[timeZone] ?? timeZone.replace(/_/g, " ")
}

export const TOO_MANY_BUCKETS_MESSAGE =
  "Este intervalo tem períodos demais para a granularidade escolhida (máximo de 1000). Encurte o intervalo ou escolha uma granularidade maior."
