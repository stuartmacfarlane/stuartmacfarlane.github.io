---
title: List Entra ID group members with Microsoft Graph PowerShell
description: Check direct group membership with a delegated Graph session and a read-only scope.
date: 2026-11-21
tags: [Entra ID, PowerShell]
---

## The problem

When someone reports a group-based access issue, start by checking the group's direct membership. Membership inherited through another group needs a transitive membership query.

## Prerequisites and permissions

Use PowerShell with the `Microsoft.Graph.Groups` module and a work or school account in your test tenant. Install the module for your current user if needed.

```powershell
Install-Module Microsoft.Graph.Groups -Scope CurrentUser
```

For a delegated session use `GroupMember.Read.All`. It requires administrator consent. The signed-in user must also be allowed to read the group under Microsoft Entra's rules. This example assumes a group with visible membership. For hidden membership, Graph also requires `Member.Read.Hidden` and the signed-in user must have the corresponding directory permission.

## Query direct members

In the Microsoft Entra admin centre, go to **Entra ID > Groups > All groups**, open the group and copy its **Object ID**. Replace the fictional GUID below with that value.

```powershell
Connect-MgGraph -Scopes 'GroupMember.Read.All' -ContextScope Process
$groupId = '11111111-2222-4333-8444-555555555555'

$members = @(Get-MgGroupMember -GroupId $groupId -All -ErrorAction Stop)
$members | Select-Object Id, @{
    Name = 'Type'
    Expression = { $_.AdditionalProperties['@odata.type'] }
}
```

`-All` follows every page. Results can include directory objects such as users and nested groups. Graph can return just the ID and type for objects whose other properties your session cannot read. The v1.0 endpoint also has a documented issue with service principals, so avoid treating this output as a complete service principal inventory.

## Verify the result

Use `Get-MgContext` to check the signed-in tenant and granted scope. Compare the returned IDs with the test group's **Members** list. A nested group can appear as a member in its own right. For the accounts inside it, use `Get-MgGroupTransitiveMember`. Use `Disconnect-MgGraph` to close the session when finished.

See Microsoft Learn for [listing members and permissions](https://learn.microsoft.com/en-us/graph/api/group-list-members?view=graph-rest-1.0), [Graph authentication commands](https://learn.microsoft.com/en-us/powershell/microsoftgraph/authentication-commands), and [the transitive membership cmdlet](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.groups/get-mggrouptransitivemember).
