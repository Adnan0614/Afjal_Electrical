/**
 * Data + mutations for the owner dashboard.
 *
 * Keeping the query/mutation wiring here leaves pages/Owner.tsx presentational and
 * makes the auth-gated fetching reusable.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { logError } from "@/lib/logger";
import type {
  AuthStatus, Lead, EmergencyDispatch, JobTracker, SiteMedia, StageAdvanceResult,
} from "@/types";

interface OwnerDashboardData {
  isOwner: boolean;
  authLoading: boolean;
  leads: Lead[];
  tickets: EmergencyDispatch[];
  jobs: JobTracker[];
  media?: SiteMedia;
  pipelineValue: number;
  loginMutation: UseMutationResult<AuthStatus, Error, string>;
  logoutMutation: UseMutationResult<AuthStatus, Error, void>;
  advanceMutation: UseMutationResult<StageAdvanceResult, Error, string>;
  saveMediaMutation: UseMutationResult<SiteMedia, Error, SiteMedia>;
}

interface OwnerDashboardOptions {
  onLoginSuccess?: () => void;
  onLoginError?: () => void;
  onMediaSaved?: (saved: SiteMedia) => void;
  mediaSavedMessage?: string;
}

export function useOwnerDashboard(options: OwnerDashboardOptions = {}): OwnerDashboardData {
  const queryClient = useQueryClient();

  const { data: auth, isLoading: authLoading } = useQuery<AuthStatus>({
    queryKey: ["auth-me"],
    queryFn: () => apiGet<AuthStatus>("/auth/me"),
    retry: false,
  });

  const isOwner: boolean = auth?.authenticated === true;

  const loginMutation = useMutation<AuthStatus, Error, string>({
    mutationFn: (pin: string) => apiPost<AuthStatus>("/auth/owner-login", { pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      options.onLoginSuccess?.();
    },
    onError: (err) => {
      logError("Owner.login", err);
      options.onLoginError?.();
    },
  });

  const logoutMutation = useMutation<AuthStatus, Error, void>({
    mutationFn: () => apiPost<AuthStatus>("/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["owner-leads"],
    queryFn: () => apiGet<Lead[]>("/leads"),
    enabled: isOwner,
  });

  const { data: tickets = [] } = useQuery<EmergencyDispatch[]>({
    queryKey: ["owner-tickets"],
    queryFn: () => apiGet<EmergencyDispatch[]>("/emergency-dispatch"),
    enabled: isOwner,
  });

  const { data: jobs = [] } = useQuery<JobTracker[]>({
    queryKey: ["owner-jobs"],
    queryFn: () => apiGet<JobTracker[]>("/jobs"),
    enabled: isOwner,
  });

  const { data: media } = useQuery<SiteMedia>({
    queryKey: ["site-media"],
    queryFn: () => apiGet<SiteMedia>("/settings/media"),
  });

  const advanceMutation = useMutation<StageAdvanceResult, Error, string>({
    mutationFn: (jobId: string) => apiPost<StageAdvanceResult>(`/jobs/${jobId}/advance`, {}),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["owner-jobs"] });
      toast.success(res.message);
    },
    onError: (err: unknown) => {
      logError("Owner.advanceStage", err);
      const detail = (err as { body?: { detail?: string } })?.body?.detail;
      toast.error(detail || "Could not update the job stage.");
    },
  });

  const saveMediaMutation = useMutation<SiteMedia, Error, SiteMedia>({
    mutationFn: (payload: SiteMedia) => apiPut<SiteMedia>("/settings/media", payload),
    onSuccess: (saved) => {
      // Seed the cache from the server response so the UI can never render a read
      // that races the write, then refresh in the background.
      queryClient.setQueryData(["site-media"], saved);
      options.onMediaSaved?.(saved);
      queryClient.invalidateQueries({ queryKey: ["site-media"] });
      toast.success(options.mediaSavedMessage || "Photos updated.");
    },
    onError: (err) => {
      logError("Owner.saveMedia", err);
      toast.error("Could not save photos. Please check the image links.");
    },
  });

  const pipelineValue: number = leads.reduce((sum, l) => sum + (l.estimated_cost || 0), 0);

  return {
    isOwner,
    authLoading,
    leads,
    tickets,
    jobs,
    media,
    pipelineValue,
    loginMutation,
    logoutMutation,
    advanceMutation,
    saveMediaMutation,
  };
}
