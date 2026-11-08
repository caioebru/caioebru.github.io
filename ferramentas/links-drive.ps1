# Lê uma pasta PÚBLICA do Google Drive e imprime o "driveArquivos" para colar no site\dados.js.
# Assim, o botão "Abrir em alta no Drive" de cada foto abre direto o arquivo dela.
# Uso:
#   .\ferramentas\links-drive.ps1 -Pasta "https://drive.google.com/drive/folders/XXXX"
# Só lê. Não altera nada no Drive.
param([Parameter(Mandatory)] [string]$Pasta)

$id = if ($Pasta -match 'folders/([\w-]+)') { $Matches[1] } else { $Pasta }
$html = (Invoke-WebRequest "https://drive.google.com/embeddedfolderview?id=$id" -UseBasicParsing).Content
$itens = [regex]::Matches($html, 'href="https://drive\.google\.com/file/d/([\w-]+)/[^"]*"[^>]*>.*?flip-entry-title">([^<]+)<', 'Singleline')

if ($itens.Count -eq 0) {
  Write-Host "Nenhum arquivo encontrado. A pasta está compartilhada como 'Qualquer pessoa com o link'? O upload terminou?" -ForegroundColor Yellow
  return
}
Write-Host "$($itens.Count) arquivos. Cole no dados.js, no lugar de driveArquivos: {}," -ForegroundColor Green
"    driveArquivos: {"
$itens | ForEach-Object { "      `"$($_.Groups[2].Value)`": `"$($_.Groups[1].Value)`"," }
"    },"
