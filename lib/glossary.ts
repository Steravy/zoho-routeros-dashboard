/** The words operators meet in field names and error messages (API contract §1). */
export const GLOSSARY: { term: string; meaning: string }[] = [
  {
    term: "PPPoE secret",
    meaning:
      "A credencial armazenada no roteador para um cliente: nome, senha, perfil, flag de desabilitado, comentário. \"O secret\" e \"a linha do cliente\" são a mesma coisa.",
  },
  {
    term: "Perfil",
    meaning: "O plano de banda/serviço associado a um secret, ex.: 10mbps.",
  },
  {
    term: "Desabilitado",
    meaning:
      "O liga/desliga do RouterOS para uma credencial. Usado só para cliente novo que ainda não pagou. Não é assim que a suspensão funciona.",
  },
  {
    term: "Perfil bloqueado",
    meaning:
      "A suspensão é uma troca de perfil: o secret de um cliente inadimplente passa para BLOQUEIO, um perfil real com velocidade reduzida. Ele continua conectando, só que devagar. O plano real fica salvo e é restaurado quando ele paga.",
  },
  {
    term: "Contratos gêmeos",
    meaning:
      "Uma pessoa com vários contratos. Os secrets extras recebem 0 ou 00 no final do username base. Um secret já vinculado a outro id do Zoho é a linha de um gêmeo — nunca o pegue.",
  },
  {
    term: "Sondagem",
    meaning:
      "Como a ponte adivinha um username sem mapeamento salvo: primeira palavra do primeiro nome em minúsculas + os 7 dígitos locais do telefone, para cada telefone do payload, depois os mesmos nomes com 0 e 00 no final. O primeiro acerto não vinculado vence.",
  },
  {
    term: "Dry-run",
    meaning:
      "Um modo de segurança. Quando ligado, toda escrita no roteador é enviada por e-mail ao responsável em vez de executada, e os assuntos dos e-mails recebem o prefixo [DRY-RUN]. Leituras não são afetadas — este painel mostra dados reais de qualquer forma.",
  },
  {
    term: "Id de cliente do Zoho",
    meaning: "A chave primária do cliente em toda esta API. Uma string.",
  },
  {
    term: "Fila",
    meaning:
      "Eventos que chegaram enquanto o roteador estava inacessível. O Zoho já recebeu 200 OK, então eles não podem ser pedidos de novo; a ponte os reprocessa quando a conexão volta e desiste após 50 tentativas ou 72 horas.",
  },
  {
    term: "Divergência",
    meaning:
      "Onde o roteador e a tabela de mapeamentos discordam: órfãos (secrets que ninguém reivindica), ausentes (mapeamentos apontando para secrets que sumiram) e ambíguos (um username reivindicado por vários ids do Zoho).",
  },
]
