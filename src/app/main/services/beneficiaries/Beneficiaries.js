import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function Beneficiaries() {
  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Beneficiaries & Executors
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your beneficiaries and designate executors
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <WoodpeckerCard>
            <Box p={4} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Beneficiaries Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive family tree and beneficiary allocation coming soon
              </Typography>
            </Box>
          </WoodpeckerCard>
        </Box>
      }
    />
  );
}

export default Beneficiaries;
