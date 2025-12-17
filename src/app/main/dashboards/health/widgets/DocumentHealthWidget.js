import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { selectEstateHealth } from '../store/estateHealthSlice';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function DocumentHealthWidget() {
  const estateHealth = useSelector(selectEstateHealth);
  const documentHealth = estateHealth?.documentHealth || 85;

  const getHealthStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'success' };
    if (score >= 60) return { label: 'Good', color: 'warning' };
    return { label: 'Needs Attention', color: 'error' };
  };

  const status = getHealthStatus(documentHealth);

  return (
    <WoodpeckerCard>
      <Box p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Document Health
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Overall Completion
          </Typography>
          <Chip
            label={status.label}
            color={status.color}
            size="small"
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2}>
          {documentHealth}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={documentHealth}
          sx={{
            height: 8,
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: documentHealth >= 80 ? '#10B981' :
                              documentHealth >= 60 ? '#F59E0B' : '#EF4444'
            }
          }}
        />

        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Key Metrics:
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2">Signed Documents</Typography>
            <Typography variant="body2" fontWeight="medium">12/14</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2">Pending Review</Typography>
            <Typography variant="body2" fontWeight="medium">2</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2">Expired</Typography>
            <Typography variant="body2" fontWeight="medium" color="error.main">1</Typography>
          </Box>
        </Box>
      </Box>
    </WoodpeckerCard>
  );
}

export default DocumentHealthWidget;
