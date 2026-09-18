# Agenda Projeto de Vida

Página estática para iPhone/iOS hospedada no GitHub Pages em `agendaprojetodevida.trentim.com`.

## Como funciona

1. A pessoa escolhe a data de início.
2. A página abre um arquivo `.ics` real hospedado em `/calendarios/AAAA-MM-DD.ics`.
3. Cada arquivo contém 21 períodos de leitura, de segunda a sexta, às 21h30, com alerta uma hora antes.
4. A automação do GitHub recria semanalmente os calendários para os três anos seguintes.

## Publicação

1. Envie estes arquivos para um repositório GitHub com a branch principal `main`.
2. Em **Settings → Pages**, selecione **GitHub Actions** como fonte.
3. Em **Custom domain**, informe `agendaprojetodevida.trentim.com`.
4. No DNS de `trentim.com`, crie o CNAME `agendaprojetodevida` apontando para o domínio GitHub Pages da conta proprietária do repositório.
5. Ative **Enforce HTTPS** quando o certificado estiver disponível.

O arquivo `site/CNAME` registra o domínio dentro do pacote. Como a publicação usa GitHub Actions, o domínio também precisa ser salvo em **Settings → Pages → Custom domain**; nessa modalidade, o GitHub informa que o arquivo `CNAME` não substitui a configuração do repositório.
