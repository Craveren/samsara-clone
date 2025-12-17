import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const HealthContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const HealthDot = styled(motion.div)(({ theme, health }) => {
  const getHealthColor = () => {
    if (health >= 80) return '#10B981'; // Green
    if (health >= 60) return '#F59E0B'; // Yellow/Orange
    return '#EF4444'; // Red
  };

  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: getHealthColor(),
    boxShadow: `0 0 10px ${getHealthColor()}40`,
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: '50%',
      backgroundColor: getHealthColor(),
      opacity: 0.3,
      animation: health >= 60 ? 'pulse 2s infinite' : 'none',
    }
  };
});

const HealthIndicator = ({
  health = 0,
  label,
  showLabel = true,
  size = 'medium',
  animated = true,
  className
}) => {
  const getHealthStatus = () => {
    if (health >= 80) return 'Excellent';
    if (health >= 60) return 'Good';
    if (health >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getHealthIcon = () => {
    if (health >= 80) return 'heroicons-solid:heart';
    if (health >= 60) return 'heroicons-solid:heart';
    if (health >= 40) return 'heroicons-solid:exclamation-triangle';
    return 'heroicons-solid:exclamation-circle';
  };

  const getHealthColor = () => {
    if (health >= 80) return '#10B981';
    if (health >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const sizeStyles = {
    small: { dotSize: 8, fontSize: '0.75rem' },
    medium: { dotSize: 12, fontSize: '0.875rem' },
    large: { dotSize: 16, fontSize: '1rem' }
  };

  return (
    <HealthContainer className={className}>
      <HealthDot
        health={health}
        animate={animated ? { scale: [1, 1.2, 1] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />

      {showLabel && (
        <Box>
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{ color: getHealthColor() }}
          >
            {health}% {getHealthStatus()}
          </Typography>
          {label && (
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          )}
        </Box>
      )}

      <FuseSvgIcon
        size={16}
        sx={{ color: getHealthColor(), ml: 0.5 }}
      >
        {getHealthIcon()}
      </FuseSvgIcon>
    </HealthContainer>
  );
};

export default HealthIndicator;
