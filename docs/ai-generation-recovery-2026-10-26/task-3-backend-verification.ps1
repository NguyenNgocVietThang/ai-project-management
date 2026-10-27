param([ValidateSet('focused','full','contracts')][string]$Mode = 'focused')
$ErrorActionPreference = 'Stop'
$taskRoot = 'C:/BA/AI Project Planning & Portfolio Management system'
$backendRoot = "$taskRoot/backend"
$testEnvironment = "$taskRoot/.superpowers/sdd/2026-10-26-ai-generation-recovery/test-env"
$python = "$testEnvironment/pinned-venv/Scripts/python.exe"
Set-Location -LiteralPath $testEnvironment
$env:PYTHONPATH = $backendRoot
$env:PYTHONIOENCODING = 'utf-8'
$env:APP_ENV = 'development'
$env:DATABASE_URL = 'postgresql+asyncpg://ai_recovery_test:synthetic@127.0.0.1:55449/ai_recovery_test'
$env:DATABASE_SSL = 'false'
$env:DATABASE_DISABLE_PREPARED_STATEMENTS = 'false'
$env:SECRET_KEY = 'local-methodology-test-secret-value-2026'
$env:REDIS_URL = 'redis://127.0.0.1:6398/0'
$env:CELERY_BROKER_URL = 'redis://127.0.0.1:6398/1'
$env:CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6398/2'
Get-ChildItem Env: | Where-Object { $_.Name -match 'API_KEY|ACCESS_TOKEN|SUPABASE|SENTRY_DSN|SMTP_PASSWORD' } | ForEach-Object { Remove-Item -LiteralPath ('Env:' + $_.Name) }
if ($Mode -eq 'contracts') {
    & $python -c "from importlib.metadata import version; print('\n'.join(f'{name}=={version(name)}' for name in ('fastapi','starlette','pydantic','pydantic-settings','sqlalchemy','ruff')))"
    if ($LASTEXITCODE) { exit $LASTEXITCODE }
    & $python "$backendRoot/scripts/export_openapi.py"
    if ($LASTEXITCODE) { exit $LASTEXITCODE }
    & $python "$backendRoot/scripts/export_openapi.py" --check
    if ($LASTEXITCODE) { exit $LASTEXITCODE }
    & $python -m ruff check "$backendRoot/app" "$backendRoot/tests" --no-cache
    exit $LASTEXITCODE
}
$testTargets = @("$backendRoot/tests")
if ($Mode -eq 'focused') {
    $testTargets = @(
        "$backendRoot/tests/unit/test_ai_project_methodology.py",
        "$backendRoot/tests/integration/test_project_from_brief_job.py",
        "$backendRoot/tests/integration/test_requirement_briefs_api.py",
        "$backendRoot/tests/integration/test_durable_ai_execution.py"
    )
}
& $python -m pytest @testTargets -q -rs -o "cache_dir=$testEnvironment/task-3-pinned-pytest-cache"
exit $LASTEXITCODE
