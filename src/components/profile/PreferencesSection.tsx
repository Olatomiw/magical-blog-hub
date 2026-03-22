import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, X, RefreshCw } from 'lucide-react';
import { getUserPreferences, saveUserPreferences, getAllCategories } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@/lib/types';

type EditState = 'idle' | 'loading-categories' | 'editing' | 'error';

const PreferencesSection = () => {
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [editState, setEditState] = useState<EditState>('idle');
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const prefs = await getUserPreferences();
        setPreferredCategories(prefs.preferredCategories || []);
      } catch (e) {
        console.error('Failed to fetch preferences:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const fetchCategories = useCallback(async () => {
    setEditState('loading-categories');
    setSaveError(null);
    try {
      const cats = await getAllCategories();
      const safe = Array.isArray(cats) ? cats : [];
      setAllCategories(safe);
      setSelected(preferredCategories.map(c => String(c.id)));
      setEditState('editing');
    } catch (e) {
      console.error('Failed to fetch categories:', e);
      setEditState('error');
    }
  }, [preferredCategories]);

  const startEditing = () => {
    if (allCategories.length > 0) {
      setSelected(preferredCategories.map(c => String(c.id)));
      setSaveError(null);
      setEditState('editing');
    } else {
      fetchCategories();
    }
  };

  const toggle = (id: string) => {
    setSaveError(null);
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = await saveUserPreferences(selected);
      setPreferredCategories(result.preferredCategories || []);
      setEditState('idle');
      toast({ title: 'Preferences updated', description: 'Your interests have been saved.' });
      window.location.reload();
    } catch (e) {
      console.error('Failed to save preferences:', e);
      setSaveError('Failed to update preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditState('idle');
    setSaveError(null);
  };

  if (isLoading) {
    return (
      <div className="mt-10 flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">Your Interests</h2>
        {editState === 'idle' && (
          <Button variant="ghost" size="sm" onClick={startEditing} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>

      {/* View mode */}
      {editState === 'idle' && (
        preferredCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {preferredCategories.map((cat) => (
              <span
                key={cat.id}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {cat.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No interests selected yet. Add some to personalise your feed.
          </p>
        )
      )}

      {/* Loading categories */}
      {editState === 'loading-categories' && (
        <div className="flex flex-wrap gap-2.5 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-full w-24" />
          ))}
        </div>
      )}

      {/* Error loading categories */}
      {editState === 'error' && (
        <div className="flex flex-col items-center py-8 gap-3">
          <p className="text-sm text-muted-foreground">Couldn't load categories. Please try again.</p>
          <div className="flex gap-3">
            <Button onClick={fetchCategories} variant="outline" size="sm" className="gap-2 rounded-full">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelEditing} className="text-muted-foreground">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Edit mode */}
      {editState === 'editing' && (
        <div>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {allCategories.map((cat) => (
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

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Changes
            </Button>
            <Button
              variant="ghost"
              onClick={cancelEditing}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesSection;
