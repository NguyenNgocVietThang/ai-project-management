param([switch]$BuildOnly)
$ErrorActionPreference = 'Stop'
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$frontend = Join-Path $repo 'frontend'
Set-Location -LiteralPath $frontend
function Invoke-NodeGate([string]$name, [string[]]$nodeArgs) {
  $log = Join-Path $PSScriptRoot ('task-4-' + $name + '.txt')
  ('node ' + ($nodeArgs -join ' ')) | Set-Content -LiteralPath $log
  & node @nodeArgs 2>&1 | Tee-Object -FilePath $log -Append
  $gateExit = $LASTEXITCODE
  Add-Content -LiteralPath $log -Value ('Exit code: ' + $gateExit)
  if ($gateExit -ne 0) { throw ($name + ' failed: ' + $gateExit) }
}
if (-not $BuildOnly) {
  Invoke-NodeGate 'frontend-tests' @('node_modules/vitest/vitest.mjs','run','src/hooks/useAuth.test.tsx','src/features/jobs/hooks','src/features/ai/components/AIGeneratorModal.test.tsx','src/features/ai/components/AIGeneratorRecovery.test.tsx','src/app/(dashboard)/layout.test.tsx','src/services/api.test.ts','src/services/auth.service.test.ts','src/i18n/catalog.test.ts','--pool=threads','--maxWorkers=1','--testTimeout=15000')
  Invoke-NodeGate 'frontend-types' @('node_modules/typescript/bin/tsc','--noEmit')
  Invoke-NodeGate 'frontend-lint' @('node_modules/eslint/bin/eslint.js','src','--ext','.js,.jsx,.ts,.tsx')
}
$env:NEXT_PUBLIC_API_URL = '/api/v1'
$env:BACKEND_PROXY_ORIGIN = 'https://qa-backend.invalid'
$env:NEXT_PUBLIC_WS_URL = 'wss://qa-backend.invalid'
$env:NEXT_TELEMETRY_DISABLED = '1'
Invoke-NodeGate 'frontend-build' @('node_modules/next/dist/bin/next','build')
