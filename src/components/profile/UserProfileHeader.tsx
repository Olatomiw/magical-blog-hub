import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/api';

const UserProfileHeader = () => {
  const { user } = useAuth();

  const totalPosts = user?.postResponseList?.length || 0;
  const totalComments = user?.postResponseList?.reduce((acc, p) => acc + (p.comments?.length || 0), 0) || 0;

  return (
    <div className="mb-10">
      {/* Cover banner */}
      <div className="relative h-40 md:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/80 via-primary/50 to-primary/30">
        <div className="absolute inset-0 bg-navy/20" />
      </div>

      {/* Avatar overlapping banner */}
      <div className="relative px-4 md:px-8 -mt-12">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
            <AvatarImage src={user?.profilePicture || user?.image} alt={user?.username || "User"} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
              {user?.firstName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-foreground">{user?.firstName} {user?.lastName}</h1>
              {user?.role && (
                <Badge variant="secondary" className="capitalize text-xs">{user.role.toLowerCase()}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
            {user?.bio && <p className="text-sm text-muted-foreground mt-1 max-w-lg">{user.bio}</p>}
            {!user?.bio && <p className="text-sm text-muted-foreground/50 mt-1 italic">No bio yet</p>}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span className="font-semibold text-foreground">{totalPosts}</span> Posts
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="font-semibold text-foreground">{totalComments}</span> Comments
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Joined {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
