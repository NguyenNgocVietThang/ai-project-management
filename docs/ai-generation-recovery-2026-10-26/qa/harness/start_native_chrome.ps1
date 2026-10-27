# Run only for owned local QA. The isolated Chrome profile contains synthetic login cookies.
$qaRuntime = Join-Path $PSScriptRoot 'runtime'
$qaProfile = Join-Path $qaRuntime 'chrome-native-profile'
New-Item -ItemType Directory -Force -Path $qaRuntime | Out-Null
$qaPort = Get-NetTCPConnection -LocalPort 3193 -State Listen -ErrorAction SilentlyContinue
if ($qaPort) {
    Write-Output 'Port3193 already listening. Reuse only after verifying it is this QA Chrome profile; this script does not stop another process.'
    exit 1
}
$qaChrome = Start-Process -FilePath 'C:/Program Files/Google/Chrome/Application/chrome.exe' -ArgumentList @(
    '--remote-debugging-port=3193', '--remote-debugging-address=127.0.0.1',
    ('--user-data-dir="' + $qaProfile + '"'), '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-extensions', '--disable-sync', 'about:blank'
) -WindowStyle Hidden -PassThru
$qaChrome.Id | Set-Content -LiteralPath (Join-Path $qaRuntime 'chrome-native.pid')
Write-Output ('Owned QA Chrome PID: ' + $qaChrome.Id)
