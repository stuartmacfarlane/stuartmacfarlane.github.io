---
title: Check installed .NET runtimes on Windows with PowerShell
description: Identify the runtime family, version and architecture available to a Windows application.
date: 2026-11-19
tags: [PowerShell, Windows]
---

## When to check

If a Windows app reports that it needs .NET, check the runtime family and architecture named in the error. A machine can have the right version of the base runtime and still be missing the desktop runtime the app needs.

## Prerequisites

Use PowerShell on the affected Windows device. The checks are read-only and do not require administrator rights. The first command assumes a modern .NET host is available on your PATH.

## List the active host's runtimes

```powershell
Get-Command dotnet.exe | Select-Object -ExpandProperty Source
dotnet --list-runtimes
```

A fictional inventory might look like this.

```text
Microsoft.NETCore.App 8.0.12 [C:\Program Files\dotnet\shared\Microsoft.NETCore.App]
Microsoft.WindowsDesktop.App 8.0.12 [C:\Program Files\dotnet\shared\Microsoft.WindowsDesktop.App]
```

Each line gives the runtime family, its version and its installation directory. `Microsoft.NETCore.App` is the base runtime, `Microsoft.WindowsDesktop.App` supplies Windows desktop support, and `Microsoft.AspNetCore.App` supplies ASP.NET Core support.

## Check both host locations

The invoked host lists runtimes for its own architecture. From **64-bit PowerShell on an x64 Windows device**, try the standard installation paths for both x64 and x86 even if `dotnet.exe` is missing from PATH.

```powershell
$hosts = @{
    x64 = Join-Path $env:ProgramFiles 'dotnet\dotnet.exe'
    x86 = Join-Path ${env:ProgramFiles(x86)} 'dotnet\dotnet.exe'
}

foreach ($architecture in 'x64', 'x86') {
    $hostPath = $hosts[$architecture]
    if (Test-Path -LiteralPath $hostPath -PathType Leaf) {
        Write-Output "[$architecture] $hostPath"
        & $hostPath --list-runtimes
    } else {
        Write-Output "[$architecture] No host at $hostPath"
    }
}
```

For custom or ARM64 installations, run the relevant host by its full path. A missing host at a standard path only tells you that the executable was absent from that location.

## Verify the result

Compare the runtime family, requested version and app architecture with the inventory. If you install a missing runtime, rerun the same command and then retry the app. Modern .NET and .NET Framework 4.x have separate inventories. For a .NET Framework application, use Microsoft's registry-based guidance.

See Microsoft Learn for [checking installed .NET versions](https://learn.microsoft.com/en-us/dotnet/core/install/how-to-detect-installed-versions), the [dotnet command reference](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet) and [detecting .NET Framework versions](https://learn.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed).
