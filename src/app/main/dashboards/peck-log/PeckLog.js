import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';
import PeckHeatmap from '@fuse/core/WoodpeckerComponents/PeckHeatmap';

function PeckLog() {
  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Peck Log
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your activity heatmap - every peck counts toward your legacy
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <WoodpeckerCard>
            <Box p={4}>
              <PeckHeatmap />
            </Box>
          </WoodpeckerCard>
        </Box>
      }
    />
  );
}

export default PeckLog;
