"use client";

import AppPreferencesContext from "@/components/contexts/app-preferences/app-preferences-context";
import { updateUserPreferences } from "@/lib/server/actions/user-preferences/user-preferences-server-actions";
import type {
  ChatWidgetPosition,
  ChatWidgetState,
} from "@/lib/types/chat-widget/chat-widget-types";
import type {
  SidebarVariant,
  UserPreferenceSidebarItemId,
  UserPreferences,
} from "@/lib/types/preferences/user-preferences-types";
import {
  mergeUserPreferences,
  normalizeUserPreferences,
} from "@/lib/user-preferences/user-preferences";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

type AppPreferencesProviderProps = {
  initialPreferences: UserPreferences;
  children: ReactNode;
};

export function AppPreferencesProvider({
  initialPreferences,
  children,
}: AppPreferencesProviderProps) {
  const [preferences, setPreferences] = useState(() =>
    normalizeUserPreferences(initialPreferences),
  );
  const [isPersisting, startTransition] = useTransition();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    startTransition(() => {
      void updateUserPreferences(preferences).then((response) => {
        if (!response.success) {
          console.error(
            "Failed to persist user preferences.",
            response.message,
          );
        }
      });
    });
  }, [preferences, startTransition]);

  const contextValue = useMemo(
    () => ({
      preferences,
      isPersisting,
      setChatWidgetState: (state: ChatWidgetState) => {
        setPreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            chatWidget: { state },
          }),
        );
      },
      setChatWidgetPosition: (position: ChatWidgetPosition) => {
        setPreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            chatWidget: { position },
          }),
        );
      },
      setSidebarOpen: (open: boolean) => {
        setPreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            sidebar: { open },
          }),
        );
      },
      setSidebarVariant: (variant: SidebarVariant) => {
        setPreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            sidebar: { variant },
          }),
        );
      },
      setPinnedSidebarItemIds: (itemIds: UserPreferenceSidebarItemId[]) => {
        setPreferences((currentPreferences) =>
          mergeUserPreferences(currentPreferences, {
            sidebar: { pinnedItemIds: itemIds },
          }),
        );
      },
    }),
    [isPersisting, preferences],
  );

  return (
    <AppPreferencesContext.Provider value={contextValue}>
      {children}
    </AppPreferencesContext.Provider>
  );
}
