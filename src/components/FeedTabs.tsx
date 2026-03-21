import { cn } from '@/lib/utils';

interface FeedTabsProps {
  activeTab: 'for-you' | 'explore';
  onTabChange: (tab: 'for-you' | 'explore') => void;
}

const FeedTabs = ({ activeTab, onTabChange }: FeedTabsProps) => {
  return (
    <div className="flex items-center gap-1 mb-8 p-1 bg-muted/50 rounded-full w-fit">
      <button
        onClick={() => onTabChange('for-you')}
        className={cn(
          'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
          activeTab === 'for-you'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        For You
      </button>
      <button
        onClick={() => onTabChange('explore')}
        className={cn(
          'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
          activeTab === 'explore'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Explore
      </button>
    </div>
  );
};

export default FeedTabs;
