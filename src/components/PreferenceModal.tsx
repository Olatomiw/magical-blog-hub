import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getAllCategoriesV1, saveUserPreferences } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Category } from '@/lib/types';
import { motion } from 'framer-motion';

interface PreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferenceModal = ({ isOpen, onClose }: PreferenceModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetch = async () => {
      try {
        const data = await getAllCategoriesV1();
        setCategories(data);
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [isOpen]);

  const toggle = (id: string) => {
    setShowHint(false);
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      setShowHint(true);
      return;
    }
    setIsSaving(true);
    try {
      await saveUserPreferences(selected);
      localStorage.setItem('preferences_selected', 'true');
      toast({ title: 'Preferences saved', description: 'Your feed is now personalised.' });
      onClose();
    } catch (e) {
      console.error('Failed to save preferences:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('preferences_selected', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
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

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
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
            )}

            {showHint && (
              <p className="text-sm text-destructive mb-4">Please select at least one category.</p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                Skip for now
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreferenceModal;
