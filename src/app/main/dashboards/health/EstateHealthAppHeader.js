import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux';
import { selectEstateHealth } from './store/estateHealthSlice';

function EstateHealthAppHeader(props) {
  const estateHealth = useSelector(selectEstateHealth);

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <div className="flex items-center space-x-16">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FuseSvgIcon size={24} color="error">
                heroicons-solid:heart
              </FuseSvgIcon>
            </div>
            <div>
              <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                Estate Health ICU
              </Typography>
              <Typography className="text-sm md:text-base text-gray-600 mt-4">
                Comprehensive monitoring of your estate planning health and progress
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <div className="text-center">
            <Typography className={`text-2xl font-bold ${getHealthColor(estateHealth?.overallHealthScore)}`}>
              {estateHealth?.overallHealthScore}/100
            </Typography>
            <Typography className="text-xs text-gray-600">
              Health Score
            </Typography>
          </div>

          <div className="text-center">
            <Typography className={`text-sm font-medium capitalize ${getRiskColor(estateHealth?.riskLevel)}`}>
              {estateHealth?.riskLevel} Risk
            </Typography>
            <Typography className="text-xs text-gray-600">
              Current Level
            </Typography>
          </div>

          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            startIcon={<FuseSvgIcon size={16}>heroicons-solid:document-report</FuseSvgIcon>}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {(estateHealth?.criticalAlerts > 0 || estateHealth?.warnings > 0) && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-16 mb-24">
          <div className="flex items-center space-x-12">
            <FuseSvgIcon size={20} color="error">
              heroicons-solid:exclamation-triangle
            </FuseSvgIcon>
            <Typography className="font-medium text-red-800">
              {estateHealth?.criticalAlerts} Critical Alert{estateHealth?.criticalAlerts !== 1 ? 's' : ''} • {estateHealth?.warnings} Warning{estateHealth?.warnings !== 1 ? 's' : ''}
            </Typography>
          </div>
          <Button variant="outlined" size="small" color="error">
            Review Issues
          </Button>
        </div>
      )}
    </div>
  );
}

export default EstateHealthAppHeader;
