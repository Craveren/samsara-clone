import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function AnalyticsDashboardAppHeader(props) {
  return (
    <>
    <div className="flex w-full container">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0 mb-10">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Fleet Electrification
          </Typography>
          <Typography className="font-medium tracking-tight mt-5" color="text.secondary">
            This Report Analyzes Your Fuel-using Passengers Vehicles and identifies suitability for your electric Repacements.
          </Typography>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
          >
            Beta
          </Button>
        </div>
      </div>
     
    </div>
    <hr/>
    <Typography className="text-3xl font-semibold tracking-tight " sx={{marginLeft:"3rem",marginBottom:"0px",marginTop:"3rem"}}>
    Summary & Ideal Electrification Criteria
  </Typography>
  </>
  );
}

export default AnalyticsDashboardAppHeader;
