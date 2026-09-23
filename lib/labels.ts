import type {
  ActionOutcome,
  ActionType,
  DriftBucket,
  FailureCode,
  OutageEndReason,
  PendingStatus,
  SuggestionSource,
  TimeWindow,
  TriggerSource,
} from "@/types/ops"
import type { BadgeVariant } from "@/types/ui"

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
