import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { selectEstateHealth } from '../store/estateHealthSlice';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function RiskAlertsWidget() {
  const estateHealth = useSelector(selectEstateHealth);

  const alerts = estateHealth?.riskAlerts || [
    {
      id: 1,
      type: 'critical',
      title: 'Will Document Expiring',
      description: 'Your will document is due for review and may need updates.',
      actionRequired: 'Review and update will',
      dueDate: '2024-02-15',
      severity: 'error'
    },
    {
      id: 2,
      type: 'critical',
      title: 'No Executor Designated',
      description: 'You have not designated an executor for your estate.',
      actionRequired: 'Nominate executor',
      dueDate: 'Immediate',
      severity: 'error'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Healthcare Directive Incomplete',
      description: 'Your healthcare directive is missing advance care instructions.',
      actionRequired: 'Complete healthcare directive',
      dueDate: '2024-03-01',
      severity: 'warning'
    },
    {
      id: 4,
      type: 'info',
      title: 'Annual Review Due',
      description: 'Time for your annual estate plan review.',
      actionRequired: 'Schedule review',
      dueDate: '2024-12-15',
      severity: 'info'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return 'heroicons-solid:exclamation-triangle';
      case 'warning': return 'heroicons-solid:exclamation';
      case 'info': return 'heroicons-solid:information-circle';
      default: return 'heroicons-solid:information-circle';
    }
  };

  return (
    <WoodpeckerCard>
      <Box p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Risk Alerts & Recommendations
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Critical issues and recommendations for your estate plan
        </Typography>

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={getSeverityColor(alert.severity)}
              icon={<FuseSvgIcon size={20}>{getSeverityIcon(alert.severity)}</FuseSvgIcon>}
              action={
                <Button color="inherit" size="small">
                  {alert.actionRequired}
                </Button>
              }
              sx={{
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {alert.title}
              </AlertTitle>
              <Typography variant="body2">
                {alert.description}
              </Typography>
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                Due: {alert.dueDate}
              </Typography>
            </Alert>
          ))}
        </Box>

        {alerts.length === 0 && (
          <Box mt={3} textAlign="center" py={4}>
            <FuseSvgIcon size={48} color="success" sx={{ mb: 2 }}>
              heroicons-solid:check-circle
            </FuseSvgIcon>
            <Typography variant="h6" color="success.main">
              All Clear!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No critical issues found in your estate plan.
            </Typography>
          </Box>
        )}

        <Box mt={3} pt={2} borderTop={1} borderColor="divider">
          <Button variant="outlined" fullWidth>
            View All Recommendations
          </Button>
        </Box>
      </Box>
    </WoodpeckerCard>
  );
}

export default RiskAlertsWidget;
