import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getSystemSettings } from "../api/systemSettingsApi";
import type { SystemSettingDto } from "../types/systemSettings";

export function useSystemSettings(key = "default"): UseQueryResult<SystemSettingDto, Error> {
  return useQuery({
    queryKey: ["system-settings", key],
    queryFn: () => getSystemSettings({ key }),
  });
}
