import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function LegalMarketplace() {
  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Legal Marketplace
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Connect with estate planning professionals
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <WoodpeckerCard>
            <Box p={4} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Legal Services Marketplace
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attorney consultations and legal services coming soon
              </Typography>
            </Box>
          </WoodpeckerCard>
        </Box>
      }
    />
  );
}

export default LegalMarketplace;
