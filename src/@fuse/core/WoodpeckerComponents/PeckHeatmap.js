import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

const HeatmapContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
  maxWidth: '280px',
}));

const HeatmapCell = styled(motion.div)(({ theme, intensity }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '2px',
  backgroundColor: intensity === 0
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'
    : intensity === 1
    ? '#DCFCE7' // Very light green
    : intensity === 2
    ? '#BBF7D0' // Light green
    : intensity === 3
    ? '#4ADE80' // Medium green
    : '#10B981', // Dark green
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    transform: 'scale(1.2)',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  }
}));

const PeckHeatmap = ({
  data = [],
  title = "Peck Log",
  subtitle = "Activity over the last year",
  className
}) => {
  // Generate mock data for the last 52 weeks if no data provided
  const heatmapData = useMemo(() => {
    if (data.length > 0) return data;

    const mockData = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic activity pattern
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const random = Math.random();

      let intensity = 0;
      if (isWeekend) {
        intensity = random > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
      } else {
        intensity = random > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      }

      mockData.push({
        date: date.toISOString().split('T')[0],
        intensity,
        count: intensity > 0 ? Math.floor(Math.random() * 5) + 1 : 0
      });
    }

    return mockData;
  }, [data]);

  // Group data by weeks
  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      weeksArray.push(heatmapData.slice(i, i + 7));
    }
    return weeksArray;
  }, [heatmapData]);

  const totalContributions = heatmapData.reduce((sum, day) => sum + day.count, 0);

  return (
    <Box className={className}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {totalContributions} contributions in the last year
      </Typography>

      <HeatmapContainer>
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <HeatmapCell
              key={`${weekIndex}-${dayIndex}`}
              intensity={day.intensity}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: (weekIndex * 7 + dayIndex) * 0.005,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                scale: 1.3,
                transition: { duration: 0.1 }
              }}
              title={`${day.date}: ${day.count} contributions`}
            />
          ))
        )}
      </HeatmapContainer>

      <Box display="flex" alignItems="center" mt={2} gap={1}>
        <Typography variant="caption" color="text.secondary">
          Less
        </Typography>
        {[0, 1, 2, 3, 4].map(intensity => (
          <Box
            key={intensity}
            sx={{
              width: 8,
              height: 8,
              borderRadius: 1,
              backgroundColor: intensity === 0
                ? 'rgba(0, 0, 0, 0.1)'
                : intensity === 1
                ? '#DCFCE7'
                : intensity === 2
                ? '#BBF7D0'
                : intensity === 3
                ? '#4ADE80'
                : '#10B981'
            }}
          />
        ))}
        <Typography variant="caption" color="text.secondary">
          More
        </Typography>
      </Box>
    </Box>
  );
};

export default PeckHeatmap;
