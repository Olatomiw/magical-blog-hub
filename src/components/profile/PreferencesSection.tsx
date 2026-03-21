import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, X } from 'lucide-react';
import { getUserPreferences, saveUserPreferences, getAllCategoriesV1 } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Category } from '@/lib/types';

const PreferencesSection = () => {
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const startEditing = async () => {
    setEditing(true);
    setSelected(preferredCategories.map(c => String(c.id)));
    if (allCategories.length === 0) {
      try {
        const cats = await getAllCategoriesV1();
        setAllCategories(cats);
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      }
    }
  };

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveUserPreferences(selected);
      setPreferredCategories(result.preferredCategories || []);
      setEditing(false);
      toast({ title: 'Preferences updated', description: 'Your interests have been saved.' });
    } catch (e) {
      console.error('Failed to save preferences:', e);
    } finally {
      setIsSaving(false);
    }
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
        {!editing && (
          <Button variant="ghost" size="sm" onClick={startEditing} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>

      {!editing ? (
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
            No preferences set — add some to personalise your feed.
          </p>
        )
      ) : (
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
              onClick={() => setEditing(false)}
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
