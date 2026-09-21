"use client";

import { useCallback, useEffect, useState } from 'react';
import { consultationService } from '@/services/messaging';
import type { ConsultationDetailDto } from '@/types/messaging';
import { toast } from '@/lib/toast-utils';

export function useConsultation(consultationId: number | null) {
  const [consultation, setConsultation] = useState<ConsultationDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchConsultation = useCallback(async () => {
    if (!consultationId) {
      setConsultation(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await consultationService.getConsultation(consultationId);
      setConsultation(data);
    } catch (err: any) {
      console.error('Failed to fetch consultation', err);
      setError(err.message ?? 'Failed to load consultation');
    } finally {
      setIsLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  const accept = useCallback(async () => {
    if (!consultationId) return;
    try {
      setActionLoading(true);
      const updated = await consultationService.acceptConsultation(consultationId);
      setConsultation(updated);
      toast.success('Consultation accepted!');
      return updated;
    } catch (err: any) {
      toast.error('Failed to accept consultation', { description: err.message });
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [consultationId]);

  const reject = useCallback(async () => {
    if (!consultationId) return;
    try {
      setActionLoading(true);
      const updated = await consultationService.rejectConsultation(consultationId);
      setConsultation(updated);
      toast.info('Consultation rejected');
      return updated;
    } catch (err: any) {
      toast.error('Failed to reject consultation', { description: err.message });
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [consultationId]);

  const complete = useCallback(async () => {
    if (!consultationId) return;
    try {
      setActionLoading(true);
      const updated = await consultationService.completeConsultation(consultationId);
      setConsultation(updated);
      toast.success('Consultation completed');
      return updated;
    } catch (err: any) {
      toast.error('Failed to complete consultation', { description: err.message });
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [consultationId]);

  const cancel = useCallback(async () => {
    if (!consultationId) return;
    try {
      setActionLoading(true);
      const updated = await consultationService.cancelConsultation(consultationId);
      setConsultation(updated);
      toast.info('Consultation cancelled');
      return updated;
    } catch (err: any) {
      toast.error('Failed to cancel consultation', { description: err.message });
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [consultationId]);

  return {
    consultation,
    isLoading,
    actionLoading,
    error,
    refresh: fetchConsultation,
    accept,
    reject,
    complete,
    cancel,
  };
}
