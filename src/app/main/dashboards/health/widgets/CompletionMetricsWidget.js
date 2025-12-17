import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { selectEstateHealth } from '../store/estateHealthSlice';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function CompletionMetricsWidget() {
  const estateHealth = useSelector(selectEstateHealth);

  const metrics = [
    {
      label: 'Documents Signed',
      current: 12,
      total: 14,
      color: '#10B981',
      icon: 'heroicons-solid:document-check'
    },
    {
      label: 'Beneficiaries Set',
      current: 3,
      total: 3,
      color: '#3B82F6',
      icon: 'heroicons-solid:user-group'
    },
    {
      label: 'Assets Inventoried',
      current: 6,
      total: 8,
      color: '#8B5CF6',
      icon: 'heroicons-solid:building-storefront'
    },
    {
      label: 'Directives Completed',
      current: 1,
      total: 3,
      color: '#F59E0B',
      icon: 'heroicons-solid:clipboard-document-list'
    }
  ];

  const overallCompletion = Math.round(
    (metrics.reduce((sum, metric) => sum + (metric.current / metric.total), 0) / metrics.length) * 100
  );

  return (
    <WoodpeckerCard>
      <Box p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Completion Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Progress across all estate planning categories
        </Typography>

        {/* Overall Progress */}
        <Box mt={2} mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="medium">
              Overall Completion
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {overallCompletion}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallCompletion}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: '#10B981'
              }
            }}
          />
        </Box>

        {/* Individual Metrics */}
        <Grid container spacing={2}>
          {metrics.map((metric, index) => {
            const percentage = Math.round((metric.current / metric.total) * 100);
            return (
              <Grid item xs={6} key={index}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: metric.color + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      color: metric.color
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {percentage}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    {metric.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric.current}/{metric.total}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Status Summary */}
        <Box mt={3} pt={2} borderTop={1} borderColor="divider">
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Status Summary:
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.5} mt={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption">Excellent Progress</Typography>
              <Typography variant="caption" color="success.main">2 categories</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption">Needs Attention</Typography>
              <Typography variant="caption" color="warning.main">2 categories</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption">Critical Gaps</Typography>
              <Typography variant="caption" color="error.main">0 categories</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </WoodpeckerCard>
  );
}

export default CompletionMetricsWidget;
