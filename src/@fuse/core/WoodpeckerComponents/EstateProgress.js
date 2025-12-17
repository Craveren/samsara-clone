import { useState } from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { motion, AnimatePresence } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)',

  '& .MuiLinearProgress-bar': {
    borderRadius: 6,
    background: 'linear-gradient(90deg, #10B981 0%, #4ADE80 50%, #22C55E 100%)',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
  }
}));

const CheckmarkAnimation = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  right: -20,
  top: -4,
  width: 20,
  height: 20,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #10B981, #4ADE80)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
}));

const EstateProgress = ({
  value = 0,
  label = "Estate Completion",
  subtitle,
  showCheckmark = true,
  animated = true,
  className,
  size = 'medium'
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedValue(value), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  const sizeStyles = {
    small: { height: 8, fontSize: '0.75rem' },
    medium: { height: 12, fontSize: '0.875rem' },
    large: { height: 16, fontSize: '1rem' }
  };

  return (
    <Box className={className}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" fontWeight="medium">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {animatedValue}%
        </Typography>
      </Box>

      {subtitle && (
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {subtitle}
        </Typography>
      )}

      <ProgressContainer>
        <StyledLinearProgress
          variant="determinate"
          value={animatedValue}
          sx={sizeStyles[size]}
        />

        <AnimatePresence>
          {showCheckmark && animatedValue === 100 && (
            <CheckmarkAnimation
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <FuseSvgIcon size={12} color="white">
                heroicons-solid:check
              </FuseSvgIcon>
            </CheckmarkAnimation>
          )}
        </AnimatePresence>
      </ProgressContainer>

      {/* Motivational message based on progress */}
      <Box mt={1}>
        <Typography variant="caption" color="text.secondary">
          {animatedValue < 25 && "Getting started is the hardest part!"}
          {animatedValue >= 25 && animatedValue < 50 && "You're making great progress!"}
          {animatedValue >= 50 && animatedValue < 75 && "More than halfway there!"}
          {animatedValue >= 75 && animatedValue < 100 && "Almost complete!"}
          {animatedValue === 100 && "🎉 Estate planning complete!"}
        </Typography>
      </Box>
    </Box>
  );
};

export default EstateProgress;
