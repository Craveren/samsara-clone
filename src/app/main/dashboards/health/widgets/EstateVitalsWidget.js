import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { selectEstateHealth } from '../store/estateHealthSlice';
import HealthIndicator from '@fuse/core/WoodpeckerComponents/HealthIndicator';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function EstateVitalsWidget() {
  const estateHealth = useSelector(selectEstateHealth);

  return (
    <WoodpeckerCard>
      <Box p={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Estate Vitals Monitor
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Real-time monitoring of your estate planning health
        </Typography>

        <Grid container spacing={3} mt={2}>
          {/* Overall Health Score */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" color="primary">
                {estateHealth?.overallHealthScore || 78}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall Health Score
              </Typography>
              <Box mt={2}>
                <LinearProgress
                  variant="determinate"
                  value={estateHealth?.overallHealthScore || 78}
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
            </Box>
          </Grid>

          {/* Document Health */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <HealthIndicator
                health={estateHealth?.documentHealth || 85}
                label="Document Health"
                showLabel={false}
              />
              <Typography variant="h4" fontWeight="bold" mt={1}>
                {estateHealth?.documentHealth || 85}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Document Completion
              </Typography>
            </Box>
          </Grid>

          {/* Task Progress */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {estateHealth?.taskCompletion || 65}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks Completed
              </Typography>
              <Box mt={2}>
                <LinearProgress
                  variant="determinate"
                  value={estateHealth?.taskCompletion || 65}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: '#F59E0B'
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Risk Level Indicator */}
        <Box mt={3} p={2} bgcolor="background.paper" borderRadius={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="medium">
              Current Risk Level
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: estateHealth?.riskLevel === 'high' ? 'error.main' :
                       estateHealth?.riskLevel === 'medium' ? 'warning.main' : 'success.main'
              }}
            >
              {estateHealth?.riskLevel?.toUpperCase() || 'MEDIUM'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </WoodpeckerCard>
  );
}

export default EstateVitalsWidget;
