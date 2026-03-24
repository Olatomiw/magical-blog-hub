import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { saveUserPreferences } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Category } from '@/lib/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface PreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = 'loading' | 'error' | 'empty' | 'loaded';

import { API } from '@/config/api';

const PreferenceModal = ({ isOpen, onClose }: PreferenceModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [modalState, setModalState] = useState<ModalState>('loading');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setModalState('loading');
    setSaveError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API.category.getAll, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      const safe = Array.isArray(data) ? data : [];

      if (safe.length === 0) {
        setCategories([]);
        setModalState('empty');
      } else {
        setCategories(safe);
        setModalState('loaded');
      }
    } catch {
      setModalState('error');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
      setSaveError(null);
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  const toggle = (id: string) => {
    setSaveError(null);
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const dismiss = () => {
    localStorage.setItem('preferences_selected', 'true');
    onClose();
  };

  const handleSave = async () => {
    if (selected.length === 0) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveUserPreferences(selected);
      localStorage.setItem('preferences_selected', 'true');
      toast({ title: 'Preferences saved', description: 'Your feed is now personalised.' });
      onClose();
      window.location.reload();
    } catch {
      setSaveError('Failed to save preferences. You can update them later in your profile.');
      localStorage.setItem('preferences_selected', 'true');
      setTimeout(() => onClose(), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-border/50">
        <div className="p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
              What do you want to read?
            </h2>
            <p className="text-muted-foreground mb-8">
              Choose your interests and we'll personalise your feed.
            </p>

            {/* State 1 — Loading */}
            {modalState === 'loading' && (
              <div className="flex flex-wrap gap-2.5 mb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-full w-24" />
                ))}
              </div>
            )}

            {/* State 2 — Error */}
            {modalState === 'error' && (
              <div className="flex flex-col items-center py-10 mb-8 gap-4">
                <p className="text-muted-foreground text-sm text-center">
                  Couldn't load categories. Please try again.
                </p>
                <Button onClick={fetchCategories} variant="outline" className="gap-2 rounded-full">
                  <RefreshCw className="h-4 w-4" /> Retry
                </Button>
                <Button variant="ghost" onClick={dismiss} className="text-muted-foreground">
                  Skip for now
                </Button>
              </div>
            )}

            {/* State 3 — Empty */}
            {modalState === 'empty' && (
              <div className="flex flex-col items-center py-10 mb-8 gap-4">
                <p className="text-muted-foreground text-sm text-center">
                  No categories available right now.
                </p>
                <Button variant="ghost" onClick={dismiss} className="text-muted-foreground">
                  Skip for now
                </Button>
              </div>
            )}

            {/* State 4 — Loaded */}
            {modalState === 'loaded' && (
              <>
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggle(String(cat.id))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        selected.includes(String(cat.id))
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card border-border/60 text-foreground hover:border-primary/50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {saveError && (
                  <p className="text-sm text-destructive mb-4">{saveError}</p>
                )}

                <div className="flex items-center justify-between gap-3">
                  <Button variant="ghost" onClick={dismiss} className="text-muted-foreground">
                    Skip for now
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || selected.length === 0}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Preferences
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreferenceModal;
