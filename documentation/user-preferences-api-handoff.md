# User Preferences API Handoff

This document is intended for the ASP.NET Core Web API assistant working on the backend implementation for user preferences.

## Goal

Implement a current-user preferences API that can persist and return a normalized `UserPreferences` document for the signed-in user. The Next.js frontend has already been scaffolded to consume this API, but backend sync is currently feature-flagged.

## Current Frontend Expectations

The frontend now has a shared `UserPreferences` contract and a single persistence flow.

- Source of truth in the UI: React context
- SSR/bootstrap source: cookies on the Next.js side
- Server sync target: ASP.NET Core Web API
- Current backend sync flag: `JOKER_USER_PREFERENCES_API_SYNC=true`

If that environment variable is not enabled, the frontend uses cookies only and does not call the backend preferences API.

## Canonical Contract

The frontend contract is currently:

```ts
export type SidebarVariant = "sidebar" | "floating" | "inset";

export type UserPreferenceSidebarItemId =
  | "home"
  | "tools"
  | "settings.app"
  | "settings.user";

export type UserPreferences = {
  version: 1;
  sidebar: {
    open: boolean;
    variant: SidebarVariant;
    pinnedItemIds: UserPreferenceSidebarItemId[];
  };
  chatWidget: {
    state: "closed" | "open" | "fullscreen";
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
};
```

## Initial Defaults

If no preferences exist yet, the backend should behave as though the current user has this document:

```json
{
  "version": 1,
  "sidebar": {
    "open": true,
    "variant": "inset",
    "pinnedItemIds": []
  },
  "chatWidget": {
    "state": "open",
    "position": "bottom-right"
  }
}
```

## Endpoint Shape

The frontend currently calls these routes:

- `GET /api/UserPreferences`
- `PATCH /api/UserPreferences`

These are current-user endpoints. The frontend does not send a user ID, so the API should resolve the user from the authenticated request context.

## Response Envelope

The frontend expects the existing shared response envelope already used elsewhere in the app:

```json
{
  "success": true,
  "message": null,
  "data": {
    "version": 1,
    "sidebar": {
      "open": true,
      "variant": "inset",
      "pinnedItemIds": []
    },
    "chatWidget": {
      "state": "open",
      "position": "bottom-right"
    }
  }
}
```

Failure shape should remain:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "data": null
}
```

## PATCH Behavior

Although the route uses `PATCH`, the current frontend sends the full normalized `UserPreferences` object, not a partial patch document.

Backend recommendation:

- Accept the full `UserPreferences` payload for now.
- Validate and normalize it server-side.
- Upsert it for the current user.
- Return the full normalized stored document.

This keeps the backend simple and lets the frontend evolve later if partial patch semantics are needed.

## Validation Rules

The backend should reject or normalize invalid values. These are the only valid enum values currently used by the frontend.

### `sidebar.variant`

- `sidebar`
- `floating`
- `inset`

### `sidebar.pinnedItemIds`

- `home`
- `tools`
- `settings.app`
- `settings.user`

### `chatWidget.state`

- `closed`
- `open`
- `fullscreen`

### `chatWidget.position`

- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`

## Recommended Backend Semantics

### Identity

Prefer a true current-user endpoint using auth claims instead of taking a user ID from the client.

### Storage Model

A single JSON-backed preferences row or document per user is the recommended starting point. This is a better fit than highly normalized relational tables for the current use case.

Suggested shape conceptually:

```csharp
public sealed class UserPreferencesEntity
{
    public Guid UserId { get; set; }
    public string PreferencesJson { get; set; } = default!;
    public DateTimeOffset UpdatedAtUtc { get; set; }
}
```

If your project already has a preferred entity/storage pattern, follow that instead.

### GET Behavior

- If a row exists for the current user, return it normalized.
- If no row exists, return the default preferences object with `success: true`.
- Do not require the frontend to seed the record before the first read.

### PATCH Behavior

- Validate incoming payload.
- Normalize duplicates in `sidebar.pinnedItemIds`.
- Remove unknown pinned item IDs.
- If no record exists, create one.
- If a record exists, replace it with the normalized document.
- Return the saved document.

## Suggested DTOs

These DTOs should be sufficient on the backend side:

```csharp
public sealed class UserPreferencesDto
{
    public int Version { get; set; }
    public SidebarPreferencesDto Sidebar { get; set; } = new();
    public ChatWidgetPreferencesDto ChatWidget { get; set; } = new();
}

public sealed class SidebarPreferencesDto
{
    public bool Open { get; set; }
    public string Variant { get; set; } = default!;
    public List<string> PinnedItemIds { get; set; } = [];
}

public sealed class ChatWidgetPreferencesDto
{
    public string State { get; set; } = default!;
    public string Position { get; set; } = default!;
}
```

## Recommended Controller Surface

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class UserPreferencesController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<UserPreferencesDto>>> GetCurrentUserPreferences()

    [HttpPatch]
    public async Task<ActionResult<ApiResponse<UserPreferencesDto>>> UpdateCurrentUserPreferences(
        [FromBody] UserPreferencesDto preferences)
}
```

Exact naming can vary with the existing project conventions.

## Frontend Merge Semantics

The Next.js app currently does the following:

- Reads a unified cookie snapshot named `user_preferences`
- Also reads legacy cookies during transition:
  - `sidebar_state`
  - `sidebar_variant`
  - `chat_widget_state`
  - `chat_widget_position`
- If backend sync is enabled, it calls `GET /api/UserPreferences` and merges the backend document with the cookie snapshot
- On client-side updates, it sends the full normalized document through `PATCH /api/UserPreferences`

Because of that flow, the backend should return a complete normalized document every time.

## Frontend Files That Reflect the Contract

These files are the best references for the backend assistant:

- [src/lib/types/preferences/user-preferences-types.ts](src/lib/types/preferences/user-preferences-types.ts)
- [src/lib/user-preferences/user-preferences.ts](src/lib/user-preferences/user-preferences.ts)
- [src/lib/server/api/user-preferences/user-preferences-api.ts](src/lib/server/api/user-preferences/user-preferences-api.ts)
- [src/lib/server/user-preferences/user-preferences-server.ts](src/lib/server/user-preferences/user-preferences-server.ts)
- [src/lib/server/actions/user-preferences/user-preferences-server-actions.ts](src/lib/server/actions/user-preferences/user-preferences-server-actions.ts)
- [src/components/providers/app-preferences/app-preferences-provider.tsx](src/components/providers/app-preferences/app-preferences-provider.tsx)
- [src/components/modules/app-sidebar/app-sidebar.tsx](src/components/modules/app-sidebar/app-sidebar.tsx)

## What Is Intentionally Deferred

The following are not implemented yet on the frontend, but the contract is ready for them:

- Actual sidebar pin/unpin UI
- Auth-specific current user handling in the frontend
- Backend-driven cache invalidation beyond the current frontend revalidation tag

## Suggested Prompt For The Backend Assistant

Use this if you want to hand off the task directly:

```text
Implement current-user preferences persistence for the Joker ASP.NET Core Web API.

Requirements:
- Add GET /api/UserPreferences and PATCH /api/UserPreferences.
- Resolve the current user from auth context; do not require a userId from the client.
- Use the following contract exactly for now:
  - version: 1
  - sidebar.open: bool
  - sidebar.variant: sidebar | floating | inset
  - sidebar.pinnedItemIds: home | tools | settings.app | settings.user
  - chatWidget.state: closed | open | fullscreen
  - chatWidget.position: top-left | top-right | bottom-left | bottom-right
- Return data in ApiResponse<T> shape: success, message, data.
- If no preferences exist, GET should return the default document instead of 404.
- PATCH currently receives the full normalized preferences document, not a partial patch.
- Validate and normalize enum values and pinned item IDs.
- Upsert the preferences for the current user and return the full saved document.

Please scaffold the DTOs, controller, service, persistence model, and validation in a way that fits the existing project structure.
```
