#requires -Version 7.0
# Creates a detached source worktree and a separate public-repository clone.
# Never runs reset, clean, merge or push.
param(
  [Parameter(Mandatory=$true)][string]$SourceRepo,
  [Parameter(Mandatory=$true)][string]$WorkspaceRoot
)
$ErrorActionPreference = 'Stop'
$Commit = '0357d1b7965c8bdb606a7fc45e75d9f4e3619897'
$Source = (Resolve-Path -LiteralPath $SourceRepo).Path
$Root = [IO.Path]::GetFullPath($WorkspaceRoot)
$Snapshot = Join-Path $Root 'AI-CookUp-source-0357d1b'
$Target = Join-Path $Root 'Poet-but-ChubbyWhale'
if (-not (Test-Path -LiteralPath (Join-Path $Source '.git'))) { throw "Not an AI-CookUp Git root: $Source" }
if ((Test-Path -LiteralPath $Snapshot) -or (Test-Path -LiteralPath $Target)) { throw 'Destination already exists; refusing to overwrite' }
Write-Output 'Source status (do not clean):'
git -C $Source status -sb
New-Item -ItemType Directory -Path $Root -Force | Out-Null
git -C $Source fetch origin codex/bigfish-v3-visuals
if ($LASTEXITCODE -ne 0) { throw 'Source fetch failed' }
git -C $Source cat-file -e "$Commit^{commit}"
if ($LASTEXITCODE -ne 0) { throw 'Frozen commit missing' }
git -C $Source worktree add --detach $Snapshot $Commit
if ($LASTEXITCODE -ne 0) { throw 'Could not create source snapshot worktree' }
git clone https://github.com/Zqing567/Poet-but-ChubbyWhale.git $Target
if ($LASTEXITCODE -ne 0) { throw 'Target clone failed; source snapshot retained for inspection' }
Write-Output "Source readonly snapshot: $Snapshot"
Write-Output "Independent public clone: $Target"
Write-Output 'No media copied and no push performed. Follow docs/MIGRATION.md.'
