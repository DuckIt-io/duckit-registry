# Sync registry JSON files to duckit-nest website
param(
  [string]$WebsiteDir = "$PSScriptRoot/../../duckit-nest"
)

$RegistryDir = Resolve-Path "$PSScriptRoot/../registry"
$PublicDir = Resolve-Path "$WebsiteDir/public/r"

Write-Host "Syncing registry to website..."
Write-Host "  Registry: $RegistryDir"
Write-Host "  Website:  $PublicDir"

# Create target directory
New-Item -ItemType Directory -Path $PublicDir -Force | Out-Null

# Copy index.json
Copy-Item -Path "$RegistryDir/index.json" -Destination "$PublicDir/index.json" -Force
Write-Host "    index.json"

# Copy per-component files
if (Test-Path "$RegistryDir/components") {
  New-Item -ItemType Directory -Path "$PublicDir/components" -Force | Out-Null
  Get-ChildItem -Path "$RegistryDir/components" -Filter "*.json" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination "$PublicDir/components/$($_.Name)" -Force
    Write-Host "    components/$($_.Name)"
  }
}

Write-Host ""
Write-Host "Sync complete!"
Write-Host "Next steps:"
Write-Host "  cd $WebsiteDir"
Write-Host "  git add public/r"
Write-Host "  git commit -m 'sync registry'"
Write-Host "  git push"
