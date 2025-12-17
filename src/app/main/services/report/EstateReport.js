import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function EstateReport() {
  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Estate Summary Report
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Comprehensive overview of your estate planning status
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <WoodpeckerCard>
            <Box p={4} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Estate Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive estate summary and reporting coming soon
              </Typography>
            </Box>
          </WoodpeckerCard>
        </Box>
      }
    />
  );
}

export default EstateReport;
