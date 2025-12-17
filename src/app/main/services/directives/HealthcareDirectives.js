import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function HealthcareDirectives() {
  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Healthcare Directives
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Advance care planning and medical directives
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <WoodpeckerCard>
            <Box p={4} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Healthcare Directives
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advance healthcare directives coming soon
              </Typography>
            </Box>
          </WoodpeckerCard>
        </Box>
      }
    />
  );
}

export default HealthcareDirectives;
