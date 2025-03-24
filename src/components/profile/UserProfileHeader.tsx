
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const UserProfileHeader = () => {
  const { user } = useAuth();

  return (
    <motion.div 
      className="mb-12 text-center md:text-left md:flex items-center gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex justify-center mb-6 md:mb-0">
        <Avatar className="w-32 h-32 border-4 border-primary/20">
          <AvatarImage 
            src={user?.profilePicture || user?.image} 
            alt={user?.username || "User profile"}
          />
          <AvatarFallback className="text-3xl">
            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </motion.div>
      
      <motion.div variants={item} className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-1">
          <User className="h-4 w-4 mr-1" />
          @{user?.username}
          {user?.role && (
            <Badge variant="outline" className="ml-2 capitalize">
              {user.role.toLowerCase()}
            </Badge>
          )}
        </p>
        {user?.bio && (
          <p className="max-w-xl text-sm md:text-base">
            {user.bio}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center md:justify-start">
          <Calendar className="h-4 w-4 mr-1" /> 
          Joined {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileHeader;
