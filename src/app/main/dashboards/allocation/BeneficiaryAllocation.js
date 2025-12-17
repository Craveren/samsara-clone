import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function BeneficiaryAllocation() {
  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Beneficiary Allocation
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage asset distribution to your beneficiaries
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <WoodpeckerCard>
            <Box p={4} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Beneficiary Allocation Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asset distribution and beneficiary management coming soon
              </Typography>
            </Box>
          </WoodpeckerCard>
        </Box>
      }
    />
  );
}

export default BeneficiaryAllocation;
