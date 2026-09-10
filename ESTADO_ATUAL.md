# BUILDLy Premium — estado atual e handoff para novo chat

> Atualizado em **10/09/2026 (UTC)**. Este documento serve para contextualizar outro assistente em uma conversa nova. Leia-o junto com `RECUPERACAO_V1_V2.md` e valide o estado real do Git antes de modificar qualquer arquivo.

## 1. Repositório e estado Git observado

- Repositório solicitado pelo usuário: `Jonacir2023/buildly-premium`.
- Diretório do clone: `/workspace/buildly-premium`.
- Branch disponível/ativa nesta sessão: `work`.
- Commit que contém a recuperação: `5f9ec02` — `Recover V1 → V2: restore meetings, documents, periodic reports, bulletin and add functional tests`.
- O clone fornecido não possui remoto configurado (`git remote -v` não retorna entradas).
- A árvore estava limpa antes da criação deste arquivo.
- **Não fazer merge na `main` sem autorização expressa.**

A conversa anterior mencionou outras hashes e uma branch `feat/recuperacao-v1-reunioes-documentos-relatorios`, mas essas refs não estão presentes neste clone. Considere o Git do ambiente atual como fonte de verdade e confirme com `git status`, `git branch -a` e `git log`.

## 2. Objetivo solicitado

Recuperar a profundidade funcional V1 → V2/Premium dos módulos:

1. **Reuniões:** atas, participantes, pauta, tópicos, responsáveis, prazos e conversão de tópico em tarefa.
2. **Documentos:** documentos/links, mural e notas da V1, preservando revisão, workflow e rastreabilidade Premium.
3. **Relatórios:** semanais, mensais e anuais, preservando os relatórios Premium existentes.

Restrições do usuário:

- não reescrever do zero nem criar versões superficiais;
- usar somente dados artificiais marcados como **TESTE**;
- não causar regressão em RDO, Efetivo, EPI, Equipamentos, Tarefas, Ocorrências, Alertas, Notas Fiscais e Medições;
- comparar explicitamente V1 × V2;
- criar PR em rascunho e não fazer merge na `main`.

## 3. Arquitetura atual

O projeto é um protótipo standalone/offline concentrado em `index.html`:

- CSS, dados de demonstração e JavaScript ficam no mesmo arquivo;
- o estado é persistido em `localStorage`;
- não há backend nem suíte de browser tests configurada; há scripts Node em `package.json`;
- `RECUPERACAO_V1_V2.md` contém a matriz resumida V1 × V2;
- `tests/modules-functional.test.js` é um smoke test Node, não um teste E2E real.

## 4. Alterações já presentes

### Reuniões

- `participants` passou a aceitar lista nominal.
- Foram adicionados `agenda` e `minutes`.
- Tópicos passaram a ter `due`, `status` e `taskId`.
- A tela de detalhe mostra participantes, pauta, ata, decisões, próxima reunião e encaminhamentos.
- A conversão de tópico cria tarefa com `origin: 'reuniao'`, `originId`, responsável e prazo do tópico.
- Uma segunda conversão do mesmo tópico é bloqueada por `taskId`.
- Há eventos de auditoria para ata, tópico e conversão.

### Documentos

- Foram adicionadas coleções `documentLinks`, `bulletinBoard` e `documentNotes`.
- A tela possui abas Documentos, Links e Mural.
- O detalhe do documento mantém revisão/status e exibe notas e histórico.
- Há formulários para link, aviso e nota, com autoria/data e auditoria.
- Links novos aceitam somente URL iniciada por HTTP(S).

### Relatórios

- Foi adicionada `periodicReports` com frequências `semanal`, `mensal` e `anual`.
- Há abas para Premium executivo e as três periodicidades da V1.
- A emissão periódica registra período, título, resumo, destaques, riscos, autoria e data.
- O painel executivo Premium e os exports CSV financeiro/RDO continuam no código.

### Compatibilidade

- A carga normaliza coleções ausentes e campos legados de reuniões/tópicos.
- A versão de metadados da demonstração foi alterada para `2.3.0-depth-recovery`.

## 5. Testes existentes e resultado conhecido

Comandos executados anteriormente:

```bash
node --check /tmp/buildly.js
node tests/modules-functional.test.js
git diff --check
```

O smoke test valida:

- existência de participantes/pauta/ata e campos de tópicos;
- presença da proteção de conversão duplicada;
- documentos, revisões, links HTTP(S), mural e notas vinculadas;
- as três frequências de relatório e preservação das strings/handlers Premium;
- existência das coleções dos módulos protegidos.

## 6. Limitações e pendências reais

A implementação **não deve ser considerada pronta para produção** pelos seguintes motivos:

1. `tests/modules-functional.test.js` executa renderizadores e a conversão tópico→tarefa, mas ainda não abre um navegador real.
2. Falta teste E2E em navegador para navegação, modais, criação, conversão, recarga e persistência.
3. A regressão dos módulos protegidos ainda é majoritariamente estrutural; faltam operações funcionais de cada módulo.
4. Não há screenshot ou artefato visual comprovando as telas recuperadas.
5. Anexos binários, links internos autenticados e PDF assinado dependem de backend/armazenamento.
6. A descrição anterior do PR alegou “manual rendering checks”, mas não há evidência versionada; não repetir essa afirmação sem executar e registrar a validação.
7. A normalização pós-importação foi corrigida e possui teste com base legada artificial 2.2; falta validá-la no seletor de arquivo de um navegador real.
8. Revisar validação de campos vazios, exclusão/edição, estados vazios e permissões para todos os novos recursos.
9. O arquivo monolítico dificulta manutenção; não faça refatoração ampla sem comparar o comportamento V1 e sem testes de caracterização.

## 7. Próximos passos recomendados, em ordem

1. Confirmar Git e criar uma branch de desenvolvimento real a partir do commit atual; não trabalhar na `main`.
2. Ler o histórico disponível e obter a V1 original, se houver remoto/artefato, para fazer comparação de código e não apenas de requisitos.
3. Adicionar testes E2E com Playwright ou ferramenta equivalente:
   - criar reunião e tópico;
   - converter tópico em tarefa e impedir duplicidade;
   - criar documento/revisão/link/nota/aviso;
   - emitir relatório semanal/mensal/anual;
   - recarregar e confirmar persistência;
   - importar/exportar base artificial TESTE.
4. Exercitar fluxos críticos de RDO, Efetivo, EPI, Equipamentos, Tarefas, Ocorrências, Alertas, NFs e Medições.
5. Executar testes por perfis com e sem permissão.
6. Gerar screenshots das três áreas após testes de navegador.
7. Atualizar `RECUPERACAO_V1_V2.md` com evidências, resultados e pendências.
8. Commitar tudo na branch de desenvolvimento e criar/atualizar PR **em rascunho**, sem merge.

## 8. Critério de encerramento sugerido

Só declarar esta onda concluída quando:

- todos os requisitos V1 estiverem mapeados para código/teste;
- os fluxos dos três módulos passarem em navegador;
- a persistência e importação legada estiverem testadas;
- os módulos protegidos tiverem regressão funcional mínima;
- houver evidência visual;
- as limitações exclusivamente de backend estiverem separadas das falhas do protótipo;
- a árvore Git estiver limpa, o commit existir na branch correta e o PR estiver em rascunho.

## 9. Prompt sugerido para o novo chat

```text
Leia primeiro ESTADO_ATUAL.md e RECUPERACAO_V1_V2.md. Confirme o estado real com git status, git branch -a e git log. Trabalhe em nova branch, nunca diretamente na main. Audite a implementação atual de Reuniões, Documentos e Relatórios contra a V1 disponível e corrija as pendências descritas no handoff, priorizando normalização após importação, testes E2E reais, regressão dos módulos protegidos e screenshots. Use somente dados artificiais TESTE. Não declare testes manuais que não tenham evidência. Ao final, rode todos os testes, faça commit e crie/atualize um PR em rascunho; não faça merge.
```
