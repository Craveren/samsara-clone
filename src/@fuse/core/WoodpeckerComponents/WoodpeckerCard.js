import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

const WoodpeckerCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%)',

  '&:hover': {
    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
    transform: 'translateY(-2px)',
  },

  '&.woodpecker-card--elevated': {
    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
  },

  '&.woodpecker-card--success': {
    borderColor: '#10B981',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)',
  },

  '&.woodpecker-card--warning': {
    borderColor: '#F59E0B',
    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)',
  },

  '&.woodpecker-card--error': {
    borderColor: '#EF4444',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.2)',
  },

  // Woodpecker pattern overlay (subtle)
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px, 80px 80px, 100px 100px',
    backgroundPosition: '0 0, 30px 30px, 60px 60px',
    pointerEvents: 'none',
    borderRadius: '16px',
  }
}));

// Enhanced WoodpeckerCard with additional props
const WoodpeckerCardComponent = ({ variant, children, className, ...props }) => {
  return (
    <WoodpeckerCard
      className={clsx(
        'woodpecker-card',
        {
          'woodpecker-card--elevated': variant === 'elevated',
          'woodpecker-card--success': variant === 'success',
          'woodpecker-card--warning': variant === 'warning',
          'woodpecker-card--error': variant === 'error',
        },
        className
      )}
      {...props}
    >
      {children}
    </WoodpeckerCard>
  );
};

export default WoodpeckerCardComponent;
