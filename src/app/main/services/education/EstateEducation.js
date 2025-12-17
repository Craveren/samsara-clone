import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function EstateEducation() {
  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Estate Education
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Learn about estate planning and legacy management
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <WoodpeckerCard>
            <Box p={4} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Estate Planning Education
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive guides and tutorials coming soon
              </Typography>
            </Box>
          </WoodpeckerCard>
        </Box>
      }
    />
  );
}

export default EstateEducation;
