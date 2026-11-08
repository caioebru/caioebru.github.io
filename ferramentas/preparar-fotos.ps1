# Prepara as fotos de uma viagem nova para o site.
# Uso (no PowerShell, dentro da pasta "Vida na Natureza - Caio e Bru"):
#   .\ferramentas\preparar-fotos.ps1 -Pasta "Nome da pasta com as fotos" -Id "lugar-aaaa-mm-dd"
#
# Cria versões leves das fotos em site\fotos\<Id>\ (thumb = miniatura, web = tela cheia)
# e imprime um modelo da viagem para colar no site\dados.js.
# As fotos originais não são alteradas.
param(
  [Parameter(Mandatory)] [string]$Pasta,
  [Parameter(Mandatory)] [string]$Id
)
Add-Type -AssemblyName System.Drawing
$raiz = Split-Path $PSScriptRoot -Parent
$origem = Resolve-Path $Pasta
$destino = Join-Path $raiz "site\fotos\$Id"

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Reduzir($img, $max, $qualidade, $arquivo) {
  $s = [Math]::Min(1.0, $max / [Math]::Max($img.Width, $img.Height))
  $w = [int]($img.Width * $s); $h = [int]($img.Height * $s)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($img, 0, 0, $w, $h)
  $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$qualidade)
  $bmp.Save($arquivo, $codec, $ep)
  $g.Dispose(); $bmp.Dispose()
}

New-Item -ItemType Directory -Force "$destino\thumb", "$destino\web" | Out-Null
$linhas = @(); $data = $null

Get-ChildItem $origem -File | Where-Object { $_.Extension -match '^\.jpe?g$' } | Sort-Object Name | ForEach-Object {
  Write-Host "  $($_.Name)"
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  if (-not $data -and $img.PropertyIdList -contains 36867) {
    $data = ([Text.Encoding]::ASCII.GetString($img.GetPropertyItem(36867).Value)).Substring(0, 10).Replace(':', '-')
  }
  if ($img.PropertyIdList -contains 274) {
    switch ($img.GetPropertyItem(274).Value[0]) {
      3 { $img.RotateFlip('Rotate180FlipNone') }
      6 { $img.RotateFlip('Rotate90FlipNone') }
      8 { $img.RotateFlip('Rotate270FlipNone') }
    }
  }
  $nome = [IO.Path]::ChangeExtension($_.Name, '.jpg')
  Reduzir $img 700 80 "$destino\thumb\$nome"
  Reduzir $img 2200 84 "$destino\web\$nome"
  $img.Dispose()
  $linhas += "      { arquivo: `"$nome`", tipo: `"ave`", especie: `"`", legenda: `"`" },"
}

Write-Host ""
Write-Host "Pronto! Cole isto no site\dados.js, dentro de VIAGENS = [ ... ], e preencha:" -ForegroundColor Green
Write-Host ""
@"
  {
    id: "$Id",
    titulo: "NOME DO LUGAR",
    lugar: "Cidade, UF",
    data: "$data",
    lat: 0, lng: 0,   // no Google Maps: botão direito no lugar > clique nos números para copiar
    capa: "$(($linhas[0] -split '"')[1])",
    resumo: "Como foi o dia.",
    fotos: [
$($linhas -join "`n")
    ],
  },
"@
