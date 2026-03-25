import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { createPost, getAllCategories } from '@/lib/api';
import { Category } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ImagePlus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CreatePost = () => {
  const { isAuthenticated, user, updateUserState } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('published');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<(number | string)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  if (!isAuthenticated) return <Navigate to="/" />;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => { setImageFile(null); setImagePreview(null); };

  const handleCategoryToggle = (categoryId: number | string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide both title and content." });
      return;
    }
    setIsLoading(true);
    try {
      await createPost(title, content, status, selectedCategoryIds, imageFile || undefined);
      toast({ title: "Published!", description: "Your post is now live." });
      navigate('/profile');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryNames = categories.filter(c => selectedCategoryIds.includes(c.id)).map(c => c.name);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-extrabold text-foreground mb-8">Create Post</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left - Form */}
              <div className="lg:col-span-3 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your article title"
                    className="h-12 text-lg border-border/60 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Categories</Label>
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all text-sm ${
                            selectedCategoryIds.includes(category.id)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-card border-border/60 hover:border-primary/50 text-foreground'
                          }`}
                        >
                          <Checkbox
                            checked={selectedCategoryIds.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                            className="hidden"
                          />
                          {category.name}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories available.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-semibold">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article here... Use double line breaks for paragraphs."
                    required
                    className="min-h-[320px] border-border/60 rounded-xl text-body leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Status</Label>
                  <div className="flex gap-4">
                    {['published', 'draft'].map(s => (
                      <label key={s} className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm transition-all ${
                        status === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border/60 text-foreground'
                      }`}>
                        <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="hidden" />
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Image & Preview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Cover Image</Label>
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-border/50">
                      <img src={imagePreview} alt="Preview" className="w-full aspect-[16/10] object-cover" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={removeImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[16/10] border-2 border-dashed border-border/50 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Upload cover image</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Live preview card */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Preview</Label>
                  <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-md">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full aspect-[16/10] object-cover" />
                    ) : (
                      <div className="w-full aspect-[16/10] bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="p-4">
                      {selectedCategoryNames.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {selectedCategoryNames.map(n => (
                            <Badge key={n} className="bg-primary/10 text-primary border-0 text-xs">{n}</Badge>
                          ))}
                        </div>
                      )}
                      <h3 className="font-bold text-foreground line-clamp-2 mb-1">{title || 'Your title here'}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{content ? content.slice(0, 100) : 'Your content preview...'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/profile')} className="rounded-xl px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Post'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePost;
