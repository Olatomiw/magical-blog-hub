
import { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileImageUploaderProps {
  firstName?: string;
  username?: string;
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  required?: boolean;
}

const ProfileImageUploader = ({
  firstName,
  username,
  imagePreview,
  onImageChange,
  required = true
}: ProfileImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageChange(file);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Profile Image {required && <span className="text-red-500">*</span>}</Label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={triggerFileInput}
      >
        <input
          type="file"
          id="image-upload"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {imagePreview ? (
          <div className="flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-2">
              <AvatarImage src={imagePreview} alt="Profile preview" />
              <AvatarFallback>
                {firstName?.charAt(0) || username?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Click to change image</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-sm font-medium">Upload a profile image</span>
            <span className="text-xs text-muted-foreground mt-1">
              Click to browse files
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUploader;
