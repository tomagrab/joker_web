"use client";

import AppPreferencesContext from "@/components/contexts/app-preferences/app-preferences-context";
import { updateUserPreferences } from "@/lib/server/actions/user-preferences/user-preferences-server-actions";
import type {
  ChatWidgetPosition,
  ChatWidgetState,
} from "@/lib/types/chat-widget/chat-widget-types";
import type {
  SidebarVariant,
  UserPreferences,
  UserPreferenceSidebarItemId,
} from "@/lib/types/preferences/user-preferences-types";
import {
  areUserPreferencesEqual,
  createUserPreferencesSnapshot,
  getUserPreferencesCookieEntries,
  mergeUserPreferences,
  normalizeUserPreferences,
  USER_PREFERENCES_COOKIE_MAX_AGE,
} from "@/lib/user-preferences/user-preferences";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

type AppPreferencesProviderProps = {
  initialPreferences: UserPreferences;
  children: ReactNode;
};

const USER_PREFERENCES_PERSIST_DEBOUNCE_MS = 750;

function writeUserPreferencesToBrowserCookies(preferences: UserPreferences) {
  for (const cookie of getUserPreferencesCookieEntries(preferences)) {
    document.cookie = `${cookie.name}=${cookie.value}; path=/; max-age=${USER_PREFERENCES_COOKIE_MAX_AGE}; samesite=lax`;
  }
}

export function AppPreferencesProvider({
  initialPreferences,
  children,
}: AppPreferencesProviderProps) {
  const initialSnapshot = createUserPreferencesSnapshot(initialPreferences);
  const [preferences, setPreferences] = useState(() =>
    normalizeUserPreferences(initialPreferences),
  );
  const [isPersisting, startTransition] = useTransition();
  const hasMountedRef = useRef(false);
  const latestPreferencesRef = useRef(preferences);
  const latestSnapshotRef = useRef(initialSnapshot);
  const lastPersistedSnapshotRef = useRef(initialSnapshot);
  const isPersistRequestInFlightRef = useRef(false);
  const persistTimeoutRef = useRef<number | null>(null);

  const flushUserPreferences = useEffectEvent(() => {
    if (isPersistRequestInFlightRef.current) {
      return;
    }

    if (latestSnapshotRef.current === lastPersistedSnapshotRef.current) {
      return;
    }

    const preferencesToPersist = latestPreferencesRef.current;

    isPersistRequestInFlightRef.current = true;

    startTransition(() => {
      void updateUserPreferences(preferencesToPersist)
        .then((response) => {
          if (!response.success) {
            console.error(
              "Failed to persist user preferences.",
              response.message,
            );
            return;
          }

          lastPersistedSnapshotRef.current = createUserPreferencesSnapshot(
            response.data ?? preferencesToPersist,
          );
        })
        .finally(() => {
          isPersistRequestInFlightRef.current = false;
        });
    });
  });

  useEffect(() => {
    const normalizedPreferences = normalizeUserPreferences(preferences);

    latestPreferencesRef.current = normalizedPreferences;
    latestSnapshotRef.current = createUserPreferencesSnapshot(
      normalizedPreferences,
    );
    writeUserPreferencesToBrowserCookies(normalizedPreferences);

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      lastPersistedSnapshotRef.current = latestSnapshotRef.current;
      return;
    }

    if (latestSnapshotRef.current === lastPersistedSnapshotRef.current) {
      if (persistTimeoutRef.current !== null) {
        window.clearTimeout(persistTimeoutRef.current);
        persistTimeoutRef.current = null;
      }

      return;
    }

    if (persistTimeoutRef.current !== null) {
      window.clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = window.setTimeout(() => {
      persistTimeoutRef.current = null;
      flushUserPreferences();
    }, USER_PREFERENCES_PERSIST_DEBOUNCE_MS);
  }, [preferences]);

  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current !== null) {
        window.clearTimeout(persistTimeoutRef.current);
      }
    };
  }, []);

  const updatePreferences = useCallback(
    (
      getNextPreferences: (
        currentPreferences: UserPreferences,
      ) => UserPreferences,
    ) => {
      setPreferences((currentPreferences) => {
        const normalizedNextPreferences = normalizeUserPreferences(
          getNextPreferences(currentPreferences),
        );

        if (
          areUserPreferencesEqual(currentPreferences, normalizedNextPreferences)
        ) {
          return currentPreferences;
        }

        return normalizedNextPreferences;
      });
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      preferences,
      isPersisting,
      setChatWidgetState: (state: ChatWidgetState) => {
        updatePreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            chatWidget: { state },
          }),
        );
      },
      setChatWidgetPosition: (position: ChatWidgetPosition) => {
        updatePreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            chatWidget: { position },
          }),
        );
      },
      setSidebarOpen: (open: boolean) => {
        updatePreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            sidebar: { open },
          }),
        );
      },
      setSidebarVariant: (variant: SidebarVariant) => {
        updatePreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            sidebar: { variant },
          }),
        );
      },
      setPinnedSidebarItemIds: (itemIds: UserPreferenceSidebarItemId[]) => {
        updatePreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            sidebar: { pinnedItemIds: itemIds },
          }),
        );
      },
    }),
    [isPersisting, preferences, updatePreferences],
  );

  return (
    <AppPreferencesContext.Provider value={contextValue}>
      {children}
    </AppPreferencesContext.Provider>
  );
}
