---
title: Structure an Intune Remediations package
description: Build a detection script and an idempotent remediation script, then test the pair on a pilot device.
date: 2026-11-20
tags: [Intune, PowerShell]
---

## The problem

A Remediations package should answer two separate questions. Does this device need a change, and can the package make it? This lab uses an empty folder named `M365-Remediation-Demo` under ProgramData so you can test that contract without touching an application or policy.

## Prerequisites

Use a disposable or pilot Windows device and a PowerShell session with permission to create a directory under ProgramData. Before deploying, check the [Intune Remediations requirements](https://learn.microsoft.com/en-us/intune/device-management/tools/deploy-remediations) for licensing, supported devices and permissions. Save both scripts as UTF-8. Use UTF-8 without a BOM if you enforce signature checks.

## Detect the missing folder

Keep detection read-only. Intune runs the remediation script only when detection exits with code `1`.

```powershell title="Detect.ps1"
$demoPath = Join-Path $env:ProgramData 'M365-Remediation-Demo'

if (Test-Path -LiteralPath $demoPath -PathType Container) {
    Write-Output 'Demo folder is present.'
    exit 0
}

Write-Output 'Demo folder is missing.'
exit 1
```

## Create the folder

The remediation can run repeatedly. An existing directory is already the desired result. If a file occupies the path, directory creation fails and the script reports the error.

```powershell title="Remediate.ps1"
$demoPath = Join-Path $env:ProgramData 'M365-Remediation-Demo'

try {
    if (-not (Test-Path -LiteralPath $demoPath -PathType Container -ErrorAction Stop)) {
        New-Item -Path $demoPath -ItemType Directory -Force -ErrorAction Stop |
            Out-Null
    }

    Write-Output 'Demo folder is present.'
    exit 0
} catch {
    Write-Output "Could not create the demo folder: $($_.Exception.Message)"
    exit 1
}
```

## Test locally before assignment

On a test machine without the demo folder, run each script in a child process and inspect its exit code. Expect `1`, `0`, then `0`.

```powershell
powershell.exe -NoProfile -File .\Detect.ps1
$LASTEXITCODE

powershell.exe -NoProfile -File .\Remediate.ps1
$LASTEXITCODE

powershell.exe -NoProfile -File .\Detect.ps1
$LASTEXITCODE
```

## Verify on a pilot device

1. In the Intune admin centre, go to **Devices > Manage devices > Scripts and remediations** and select **Create script package**.
2. Upload `Detect.ps1` and `Remediate.ps1` in their respective fields. For this machine-wide example, set **Run this script using the logged-on credentials** to **No**. Use 64-bit PowerShell for the x64 pilot.
3. Assign the package to a pilot device group. After it runs, open the package and inspect **Device status**, then check that the demo folder exists on the pilot device. On a later scheduled run, detection should find the folder and exit `0`.

See Microsoft Learn for the [deployment steps and reporting options](https://learn.microsoft.com/en-us/intune/device-management/tools/deploy-remediations).
