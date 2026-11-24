import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { LostFoundItem, ClaimRequest, MatchResult, ItemStatus } from '../types';
import { findAllMatches, findMatchesForItem } from '../utils/matching';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  items: LostFoundItem[];
  claims: ClaimRequest[];
  matches: MatchResult[];
  loading: boolean;
  isConfigured: boolean;
  refreshData: () => Promise<void>;
  addItem: (itemData: {
    type: 'lost' | 'found';
    title: string;
    category: any;
    color: string;
    location: any;
    date: string;
    description: string;
    imageUrl?: string;
  }) => Promise<LostFoundItem | null>;
  updateItemStatus: (id: string, status: ItemStatus) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  markReturned: (id: string) => Promise<boolean>;
  submitClaim: (lostItemId: string, foundItemId: string, message: string) => Promise<boolean>;
  getItemMatches: (item: LostFoundItem) => MatchResult[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toasts: ToastInfo[];
  removeToast: (id: string) => void;
  stats: {
    totalLost: number;
    totalFound: number;
    totalReturned: number;
    activeMatchesCount: number;
    myLostCount: number;
    myFoundCount: number;
  };
}

const LOCAL_STORAGE_BACKUP_KEY = 'campus_lf_supabase_backup_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const isConfigured = isSupabaseConfigured();

  const [items, setItems] = useState<LostFoundItem[]>(() => {
    // If local backup exists, load it initially
    try {
      const backup = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Toast Helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Items & Claims from Supabase
  const refreshData = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemsError) {
        console.error('Error fetching items from Supabase:', itemsError);
        showToast(`Database error: ${itemsError.message}`, 'error');
      } else if (itemsData) {
        // Map database columns to app schema
        const normalized: LostFoundItem[] = itemsData.map((row: any) => ({
          ...row,
          imageUrl: row.image_url,
          reporterName: row.reporter_name,
          reporterStudentId: row.reporter_student_id,
          reporterContactHidden: row.reporter_contact_hidden,
          returnDate: row.return_date,
          createdAt: row.created_at,
        }));
        setItems(normalized);
        localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(normalized));
      }

      // 2. Fetch claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (claimsError) {
        console.warn('Error fetching claims:', claimsError);
      } else if (claimsData) {
        setClaims(claimsData);
      }
    } catch (err: any) {
      console.error('Unexpected error during data refresh:', err);
    } finally {
      setLoading(false);
    }
  }, [isConfigured, showToast]);

  // Initial load and Realtime setup
  useEffect(() => {
    refreshData();

    if (!isConfigured) return;

    // Supabase Realtime subscription for instant multi-user synchronization
    const channel = supabase
      .channel('campus-items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        () => {
          refreshData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'claims' },
        () => {
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConfigured, refreshData]);

  // Smart Matching engine calculations
  const matches = useMemo(() => {
    return findAllMatches(items);
  }, [items]);

  const getItemMatches = useCallback(
    (item: LostFoundItem): MatchResult[] => {
      return findMatchesForItem(item, items);
    },
    [items]
  );

  // Add Item to Supabase
  const addItem = async (itemData: {
    type: 'lost' | 'found';
    title: string;
    category: any;
    color: string;
    location: any;
    date: string;
    description: string;
    imageUrl?: string;
  }): Promise<LostFoundItem | null> => {
    const reporterName = profile?.full_name || user?.email?.split('@')[0] || 'Campus Student';
    const reporterStudentId = profile?.student_id || 'STU-ID';
    const reporterContactHidden = profile?.email || user?.email || 'student@campus.edu';
    const userId = user?.id || '00000000-0000-0000-0000-000000000000';

    const dbPayload = {
      user_id: userId,
      type: itemData.type,
      title: itemData.title,
      category: itemData.category,
      color: itemData.color,
      location: itemData.location,
      date: itemData.date,
      description: itemData.description,
      image_url: itemData.imageUrl || null,
      status: 'Open',
      reporter_name: reporterName,
      reporter_student_id: reporterStudentId,
      reporter_contact_hidden: reporterContactHidden,
    };

    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('items')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          showToast(`Failed to save report: ${error.message}`, 'error');
          return null;
        }

        const createdItem: LostFoundItem = {
          ...data,
          imageUrl: data.image_url,
          reporterName: data.reporter_name,
          reporterStudentId: data.reporter_student_id,
          reporterContactHidden: data.reporter_contact_hidden,
          returnDate: data.return_date,
          createdAt: data.created_at,
        };

        setItems((prev) => [createdItem, ...prev]);

        // Check for matches
        const newMatches = findMatchesForItem(createdItem, items);
        if (newMatches.length > 0) {
          showToast(
            `Report published! ${newMatches.length} possible ${newMatches.length === 1 ? 'match' : 'matches'} detected!`,
            'info'
          );
        } else {
          showToast(
            `${itemData.type === 'lost' ? 'Lost' : 'Found'} report submitted to campus database!`,
            'success'
          );
        }

        return createdItem;
      } catch (err: any) {
        showToast(`Error: ${err.message}`, 'error');
        return null;
      }
    } else {
      // Local fallback if Supabase credentials are not yet entered
      const fallbackItem: LostFoundItem = {
        id: `local-${Date.now()}`,
        user_id: userId,
        type: itemData.type,
        title: itemData.title,
        category: itemData.category,
        color: itemData.color,
        location: itemData.location,
        date: itemData.date,
        description: itemData.description,
        imageUrl: itemData.imageUrl,
        image_url: itemData.imageUrl,
        status: 'Open',
        reporterName,
        reporter_name: reporterName,
        reporterStudentId,
        reporter_student_id: reporterStudentId,
        reporterContactHidden,
        reporter_contact_hidden: reporterContactHidden,
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      setItems((prev) => {
        const updated = [fallbackItem, ...prev];
        localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(updated));
        return updated;
      });

      showToast(
        `${itemData.type === 'lost' ? 'Lost' : 'Found'} report registered! (Connect Supabase to sync in cloud)`,
        'success'
      );
      return fallbackItem;
    }
  };

  // Update item status
  const updateItemStatus = async (id: string, status: ItemStatus): Promise<boolean> => {
    const returnDate = status === 'Returned' ? new Date().toISOString().split('T')[0] : null;

    if (isConfigured) {
      try {
        const { error } = await supabase
          .from('items')
          .update({
            status,
            return_date: returnDate,
          })
          .eq('id', id);

        if (error) {
          showToast(`Failed to update status: ${error.message}`, 'error');
          return false;
        }
      } catch (err: any) {
        showToast(`Error: ${err.message}`, 'error');
        return false;
      }
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status, return_date: returnDate || undefined, returnDate: returnDate || undefined } : i
      )
    );
    showToast(`Status updated to "${status}"`, 'info');
    return true;
  };

  const markReturned = async (id: string): Promise<boolean> => {
    return updateItemStatus(id, 'Returned');
  };

  // Delete item
  const deleteItem = async (id: string): Promise<boolean> => {
    if (isConfigured) {
      try {
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) {
          showToast(`Failed to delete: ${error.message}`, 'error');
          return false;
        }
      } catch (err: any) {
        showToast(`Error: ${err.message}`, 'error');
        return false;
      }
    }

    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(updated));
      return updated;
    });

    setClaims((prev) => prev.filter((c) => c.lost_item_id !== id && c.found_item_id !== id));
    showToast('Report deleted successfully', 'info');
    return true;
  };

  // Submit claim / interest
  const submitClaim = async (lostItemId: string, foundItemId: string, message: string): Promise<boolean> => {
    const claimantId = user?.id || '00000000-0000-0000-0000-000000000000';

    if (isConfigured) {
      try {
        const { error } = await supabase.from('claims').insert([
          {
            lost_item_id: lostItemId,
            found_item_id: foundItemId,
            claimant_id: claimantId,
            message,
            status: 'Pending Verification',
          },
        ]);

        if (error) {
          showToast(`Failed to submit claim: ${error.message}`, 'error');
          return false;
        }

        // Update item statuses to Pending
        await supabase
          .from('items')
          .update({ status: 'Pending' })
          .in('id', [lostItemId, foundItemId]);
      } catch (err: any) {
        showToast(`Error: ${err.message}`, 'error');
        return false;
      }
    }

    setClaims((prev) => [
      {
        id: `claim-${Date.now()}`,
        lost_item_id: lostItemId,
        found_item_id: foundItemId,
        claimant_id: claimantId,
        message,
        status: 'Pending Verification',
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setItems((prev) =>
      prev.map((i) => (i.id === lostItemId || i.id === foundItemId ? { ...i, status: 'Pending' } : i))
    );

    showToast('Claim registered! Staff and owner notified for verification.', 'success');
    return true;
  };

  // Stats calculation
  const stats = useMemo(() => {
    const totalLost = items.filter((i) => i.type === 'lost').length;
    const totalFound = items.filter((i) => i.type === 'found').length;
    const totalReturned = items.filter((i) => i.status === 'Returned').length;

    const currentUserId = user?.id;
    const currentStudentId = profile?.student_id;
    const currentName = profile?.full_name?.toLowerCase();

    const myLostCount = items.filter((i) => {
      if (i.type !== 'lost') return false;
      if (currentUserId && i.user_id === currentUserId) return true;
      if (currentStudentId && (i.reporter_student_id === currentStudentId || i.reporterStudentId === currentStudentId)) return true;
      if (currentName && (i.reporter_name?.toLowerCase() === currentName || i.reporterName?.toLowerCase() === currentName)) return true;
      return false;
    }).length;

    const myFoundCount = items.filter((i) => {
      if (i.type !== 'found') return false;
      if (currentUserId && i.user_id === currentUserId) return true;
      if (currentStudentId && (i.reporter_student_id === currentStudentId || i.reporterStudentId === currentStudentId)) return true;
      if (currentName && (i.reporter_name?.toLowerCase() === currentName || i.reporterName?.toLowerCase() === currentName)) return true;
      return false;
    }).length;

    return {
      totalLost,
      totalFound,
      totalReturned,
      activeMatchesCount: matches.length,
      myLostCount,
      myFoundCount,
    };
  }, [items, matches, user, profile]);

  return (
    <AppContext.Provider
      value={{
        items,
        claims,
        matches,
        loading,
        isConfigured,
        refreshData,
        addItem,
        updateItemStatus,
        deleteItem,
        markReturned,
        submitClaim,
        getItemMatches,
        showToast,
        toasts,
        removeToast,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
