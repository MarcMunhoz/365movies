---
trigger: always_on
---

## Regras obrigatórias

- Quando necessário, rodar build ou scripts do package manager APENAS no contexto do container, nunca no host.
- Ao solicitar um commit, usar o padrão GitHub com a mensagem escrita em inglês.
- No título do commit, usar verbo no simple present, na terceira pessoa do singular, iniciar a mensagem com letra maiúscula e manter concordância com o escopo da alteração.
- Preferir títulos no formato `tipo(escopo): Adjusts ...`, `Adds ...`, `Fixes ...`, `Removes ...`, `Updates ...`.
- Não usar o verbo no imperativo no título, como `Adjust ...`, `Add ...`, `Fix ...`, `Remove ...` ou `Update ...`.
- Na descrição do commit, não inserir linhas em branco entre os itens.
- O título do commit deve ficar apenas na primeira linha, sem descrição anexada.
- A descrição deve ficar no corpo do commit, usando `-m` separado para não grudar no título.
- Formato obrigatório da mensagem de commit:
  `tipo(escopo): Summarized message`
  `- Explanatory description 01`
  `- Explanatory description 02`
- Tipos permitidos de commit:
  `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
