# Vida na Natureza · Caio & Bru

O site de vocês com as viagens, as fotos e as espécies.

## Como abrir

Dê dois cliques em `site/index.html`. Ele abre no navegador.
O mapa precisa de internet para carregar. O resto funciona offline.

## O que tem em cada pasta

```
Vida na Natureza - Caio e Bru/
├── Horto Florestal 07.11.2026 - Bauru/   ← fotos ORIGINAIS (o site não mexe nelas)
├── site/
│   ├── index.html      ← abra este
│   ├── dados.js        ← viagens e espécies (é o único arquivo que vocês editam)
│   ├── app.js, estilo.css
│   └── fotos/<viagem>/thumb e web   ← cópias leves, geradas pelo script
└── ferramentas/
    └── preparar-fotos.ps1   ← prepara as fotos de uma viagem nova
```

## Adicionar uma viagem nova

1. Coloque as fotos numa pasta aqui dentro, por exemplo `Serra do Cipó 15.12.2026`.
2. Abra o PowerShell nesta pasta (Shift + botão direito na pasta > "Abrir no Terminal") e rode:
   ```
   .\ferramentas\preparar-fotos.ps1 -Pasta "Serra do Cipó 15.12.2026" -Id "serra-do-cipo-2026-12-15"
   ```
   O `Id` é um nome curto, sem espaços nem acentos.
3. O script mostra um bloco pronto. Cole esse bloco em `site/dados.js`, dentro de `VIAGENS = [ ... ]`, logo depois da última viagem.
4. Preencha o bloco:
   - `titulo`, `lugar`, `resumo`
   - `lat` e `lng`: no Google Maps, clique com o botão direito no lugar e clique nos números que aparecem para copiar.
   - `capa`: a foto que aparece no mapa e no card.
   - Em cada foto: `tipo` (`"ave"`, `"inseto"`, `"paisagem"` ou `"nos"`), `especie` (chave do catálogo `ESPECIES`, ou apague o campo) e `legenda` (opcional).
5. Para uma espécie que ainda não está no catálogo, copie um bloco de `ESPECIES` e ajuste.
   `confianca` pode ser `"alta"`, `"provavel"` ou `"a-confirmar"`.

Ou mandem as fotos para o Claude: ele roda o script, identifica os bichos e preenche tudo.

## GitHub Pages

O site está em **https://caioebru.github.io**
(repositório: https://github.com/caioebru/caioebru.github.io, na organização "caioebru").

Para atualizar depois de mudar algo, abra o PowerShell nesta pasta e rode:
```
git add -A
git commit -m "o que mudou"
git push
```
Em um ou dois minutos o site novo está no ar.

Como está configurado:
- `.gitignore` manda só `site/`, `ferramentas/` e este guia. As fotos originais não sobem.
- `.github/workflows/pages.yml` publica a pasta `site/` sozinho a cada envio para a branch `main`.
- No GitHub, em Settings > Pages, escolha "Source: GitHub Actions".

No GitHub Pages o mapa mostra as ruas (OpenStreetMap). Na página publicada no Claude as imagens de outros sites são bloqueadas, então lá o mapa volta a mostrar só o contorno dos estados.

## Site online e fotos em alta

- O site publicado fica em https://claude.ai/artifact/SuauY5onM4UQqiS1b8grne. Ele usa as fotos em baixa. Para a Bru abrir, compartilhe pelo menu Share da página.
- `site/publicar.html` é a versão do `index.html` usada na publicação. Se mudar um, mude o outro.
- Os botões "Drive" levam às fotos em alta na pasta compartilhada do Google Drive (`DRIVE_GERAL` e `drive` de cada viagem, no `dados.js`).
- Para o botão de cada foto abrir direto o arquivo dela, rode:
  ```
  .\ferramentas\links-drive.ps1 -Pasta "link da pasta da viagem no Drive"
  ```
  e cole o resultado no `driveArquivos` da viagem. A pasta precisa estar como "Qualquer pessoa com o link".

## Sobre as identificações

As espécies foram identificadas pelas fotos, e o selo de cada uma mostra o grau de certeza.
Para confirmar as marcadas como "a confirmar" (os dois besouros e a borboleta de faixas amarelas),
postem as fotos no [iNaturalist](https://www.inaturalist.org). A comunidade de especialistas costuma responder em poucos dias.
Depois é só atualizar o `dados.js`.
