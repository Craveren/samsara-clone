import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { selectEstateHealth } from '../store/estateHealthSlice';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function TaskProgressWidget() {
  const estateHealth = useSelector(selectEstateHealth);
  const taskCompletion = estateHealth?.taskCompletion || 65;

  const taskCategories = [
    { name: 'Documents', completed: 4, total: 4, color: 'success' },
    { name: 'Beneficiaries', completed: 2, total: 2, color: 'success' },
    { name: 'Assets', completed: 3, total: 3, color: 'success' },
    { name: 'Healthcare', completed: 1, total: 2, color: 'warning' },
    { name: 'Digital', completed: 2, total: 3, color: 'warning' }
  ];

  const totalTasks = taskCategories.reduce((sum, cat) => sum + cat.total, 0);
  const completedTasks = taskCategories.reduce((sum, cat) => sum + cat.completed, 0);

  return (
    <WoodpeckerCard>
      <Box p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Task Progress
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Overall Completion
          </Typography>
          <Chip
            label={`${completedTasks}/${totalTasks}`}
            color="primary"
            size="small"
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2}>
          {Math.round((completedTasks / totalTasks) * 100)}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={(completedTasks / totalTasks) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: '#3B82F6'
            }
          }}
        />

        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category Breakdown:
          </Typography>

          <Box mt={2} display="flex" flexDirection="column" gap={1.5}>
            {taskCategories.map((category) => (
              <Box key={category.name}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="body2" fontWeight="medium">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.completed}/{category.total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(category.completed / category.total) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      backgroundColor: category.color === 'success' ? '#10B981' : '#F59E0B'
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Next Recommended Task */}
        <Box mt={3} p={2} bgcolor="primary.light" borderRadius={1}>
          <Typography variant="body2" fontWeight="medium" color="primary.dark">
            Next: Complete Healthcare Directives
          </Typography>
          <Typography variant="caption" color="primary.dark">
            1 of 2 tasks remaining in Healthcare category
          </Typography>
        </Box>
      </Box>
    </WoodpeckerCard>
  );
}

export default TaskProgressWidget;
