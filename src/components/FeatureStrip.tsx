import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '✦',
    title: 'AI-Powered Summaries',
    description: 'Get the key points of any post in seconds. Powered by Claude AI.',
    highlight: true,
    cta: 'Try Summarize →',
  },
  {
    icon: '◈',
    title: 'Personalised Feed',
    description: 'Your feed, curated to your interests. The more you read, the better it gets.',
  },
  {
    icon: '❖',
    title: 'Stories That Matter',
    description: 'Thoughtful writing on tech, science, culture, and beyond.',
  },
];

const FeatureStrip = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
    >
      {features.map((f, i) => (
        <div
          key={i}
          className={`relative rounded-2xl p-6 border transition-all duration-300 ${
            f.highlight
              ? 'bg-card/80 backdrop-blur-sm border-primary/30 shadow-md shadow-primary/5'
              : 'bg-card/60 backdrop-blur-sm border-border/50'
          }`}
        >
          {f.highlight && (
            <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-primary" />
          )}
          <div className="text-xl mb-3 text-primary">{f.icon}</div>
          <h3 className="font-bold text-foreground mb-1.5 text-sm">{f.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
          {f.cta && (
            <button
              onClick={() => navigate('/')}
              className="mt-3 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {f.cta}
            </button>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default FeatureStrip;
