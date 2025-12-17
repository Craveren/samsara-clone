import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'signed':
        return {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(16, 185, 129, 0.2)'
            : 'rgba(16, 185, 129, 0.1)',
          color: '#10B981',
          borderColor: '#10B981',
        };
      case 'pending':
        return {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(245, 158, 11, 0.2)'
            : 'rgba(245, 158, 11, 0.1)',
          color: '#F59E0B',
          borderColor: '#F59E0B',
        };
      case 'expired':
        return {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(239, 68, 68, 0.2)'
            : 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
          borderColor: '#EF4444',
        };
      case 'draft':
        return {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(156, 163, 175, 0.2)'
            : 'rgba(156, 163, 175, 0.1)',
          color: '#6B7280',
          borderColor: '#6B7280',
        };
      case 'uploaded':
      default:
        return {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(59, 130, 246, 0.2)'
            : 'rgba(59, 130, 246, 0.1)',
          color: '#3B82F6',
          borderColor: '#3B82F6',
        };
    }
  };

  return {
    border: '1px solid',
    fontWeight: 500,
    fontSize: '0.75rem',
    height: 24,
    '& .MuiChip-icon': {
      fontSize: '0.875rem',
    },
    ...getStatusStyles(),
  };
});

const DocumentStatus = ({
  status = 'uploaded',
  showIcon = true,
  size = 'small',
  ...props
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'signed':
        return 'heroicons-solid:check-circle';
      case 'pending':
        return 'heroicons-solid:clock';
      case 'expired':
        return 'heroicons-solid:exclamation-triangle';
      case 'draft':
        return 'heroicons-solid:pencil';
      case 'uploaded':
      default:
        return 'heroicons-solid:cloud-upload';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'signed':
        return 'Signed';
      case 'pending':
        return 'Pending';
      case 'expired':
        return 'Expired';
      case 'draft':
        return 'Draft';
      case 'uploaded':
      default:
        return 'Uploaded';
    }
  };

  return (
    <StatusChip
      status={status}
      icon={showIcon ? <FuseSvgIcon size={14}>{getStatusIcon()}</FuseSvgIcon> : undefined}
      label={getStatusLabel()}
      size={size}
      variant="outlined"
      {...props}
    />
  );
};

export default DocumentStatus;
