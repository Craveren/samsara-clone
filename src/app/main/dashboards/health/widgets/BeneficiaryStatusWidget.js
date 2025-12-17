import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { selectEstateHealth } from '../store/estateHealthSlice';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function BeneficiaryStatusWidget() {
  const estateHealth = useSelector(selectEstateHealth);

  const beneficiaryStats = {
    total: 3,
    configured: 2,
    needsAttention: 1,
    executors: 1,
    unallocatedPercentage: 0
  };

  const completionPercentage = (beneficiaryStats.configured / beneficiaryStats.total) * 100;

  return (
    <WoodpeckerCard>
      <Box p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Beneficiary Status
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Configuration Progress
          </Typography>
          <Chip
            label={`${beneficiaryStats.configured}/${beneficiaryStats.total}`}
            color="primary"
            size="small"
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2}>
          {Math.round(completionPercentage)}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: '#10B981'
            }
          }}
        />

        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Beneficiaries:
          </Typography>

          {/* Sample Beneficiary List */}
          <Box mt={2} display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                  SJ
                </Avatar>
                <Typography variant="body2">Sarah Johnson</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="success.main">50%</Typography>
                <Chip label="Executor" size="small" color="secondary" />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'blue.main', fontSize: '0.75rem' }}>
                  EJ
                </Avatar>
                <Typography variant="body2">Emily Johnson</Typography>
              </Box>
              <Typography variant="body2" color="success.main">25%</Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'purple.main', fontSize: '0.75rem' }}>
                  MJ
                </Avatar>
                <Typography variant="body2">Michael Johnson</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="warning.main">25%</Typography>
                <Chip label="Needs Review" size="small" color="warning" />
              </Box>
            </Box>
          </Box>

          {beneficiaryStats.unallocatedPercentage > 0 && (
            <Box mt={2} p={2} bgcolor="warning.light" borderRadius={1}>
              <Typography variant="body2" color="warning.dark">
                {beneficiaryStats.unallocatedPercentage}% of assets unallocated
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </WoodpeckerCard>
  );
}

export default BeneficiaryStatusWidget;
