# Matriz de recuperação V1 → V2/Premium

Todos os dados de validação são artificiais e identificados como **TESTE**.

| Módulo | Baseline V1 | Lacuna V2 | Recuperado |
|---|---|---|---|
| Reuniões | Participantes, pauta, ata, tópicos, decisões, responsáveis, prazos e tarefa | Contagem de participantes; sem ata/pauta/prazo persistidos | Participantes estruturados, ata/pauta, tópico com prazo/status e conversão idempotente/rastreável em tarefa |
| Documentos | Documentos/links, mural e notas | Somente GED e revisões | Links, mural e notas integrados; GED, workflow, revisão e histórico Premium preservados |
| Relatórios | Semanais, mensais e anuais | Somente executivo Premium | Três periodicidades com autoria, período, resumo, destaques e riscos; executivo e CSVs preservados |

## Pendências produtivas

- Anexos binários e links internos autenticados exigem backend/armazenamento.
- PDF assinado no servidor exige integração backend; impressão nativa permanece disponível.
