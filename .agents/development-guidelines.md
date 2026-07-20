# Diretrizes Globais de Desenvolvimento

## Stack Tecnológica Principal
- Vue 3 (Composition API, `<script setup>`)
- Quasar Framework (Componentes e CLI)
- Tailwind CSS (Estilização utilitária e layout)
- TypeScript (Modo estrito, tipagem explícita para props e retornos)

## Estilo de Código e Restrições
- **Direto ao Ponto:** Remova qualquer comentário prolixo, óbvio ou meta-comentários (como "Passo 1", "Correção aqui", "Variáveis globais"). O código deve ser técnico e autoexplicativo.
- **Performance:** Evite computações pesadas dentro do template do Vue. Use `computed` de forma eficiente para o mapeamento dos 365 dias do ano.
- **Ecossistema Quasar:** Sempre que houver necessidade de componentes de feedback visual ou utilitários (ex: Tooltips, Spinners), utilize os componentes nativos do Quasar (ex: `QTooltip`).
- **Tipagem:** Proibido o uso de `any`. Defina interfaces claras para todas as estruturas de dados.
