import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const NodeContainer = styled(motion.div)(({ theme, isSelected, isExecutor, isBeneficiary }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: isSelected
    ? theme.palette.primary.main + '20'
    : theme.palette.background.paper,
  border: `2px solid ${
    isExecutor
      ? '#F59E0B'
      : isBeneficiary
      ? '#10B981'
      : theme.palette.divider
  }`,
  boxShadow: isSelected
    ? `0 4px 20px ${theme.palette.primary.main}30`
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minWidth: 140,
  position: 'relative',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
  }
}));

const AllocationBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -8,
  right: -8,
  height: 20,
  fontSize: '0.7rem',
  backgroundColor: '#10B981',
  color: 'white',
}));

const RoleIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: -8,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(0.5),
}));

const BeneficiaryNode = ({
  person,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetAsBeneficiary,
  onSetAsExecutor,
  onUpdateAllocation,
  allocation = 0,
  isExecutor = false,
  isBeneficiary = false,
  className
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleClose();
    switch (action) {
      case 'edit':
        onEdit?.(person);
        break;
      case 'delete':
        onDelete?.(person);
        break;
      case 'beneficiary':
        onSetAsBeneficiary?.(person.id);
        break;
      case 'executor':
        onSetAsExecutor?.(person.id);
        break;
      default:
        break;
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRelationshipColor = () => {
    switch (person.relationship) {
      case 'spouse': return '#EC4899';
      case 'child': return '#3B82F6';
      case 'parent': return '#8B5CF6';
      case 'sibling': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <NodeContainer
      isSelected={isSelected}
      isExecutor={isExecutor}
      isBeneficiary={isBeneficiary}
      onClick={() => onSelect?.(person)}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Allocation Badge */}
      {allocation > 0 && (
        <AllocationBadge
          label={`${allocation}%`}
          size="small"
        />
      )}

      {/* Avatar */}
      <Avatar
        sx={{
          width: 48,
          height: 48,
          bgcolor: getRelationshipColor(),
          mb: 1
        }}
      >
        {getInitials(person.name)}
      </Avatar>

      {/* Name */}
      <Typography variant="subtitle2" fontWeight="medium" align="center">
        {person.name}
      </Typography>

      {/* Relationship */}
      <Typography variant="caption" color="text.secondary" align="center">
        {person.relationship}
      </Typography>

      {/* Role Indicators */}
      <RoleIndicator>
        {isExecutor && (
          <Chip
            label="Executor"
            size="small"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              bgcolor: '#F59E0B',
              color: 'white'
            }}
          />
        )}
        {isBeneficiary && (
          <Chip
            label="Beneficiary"
            size="small"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              bgcolor: '#10B981',
              color: 'white'
            }}
          />
        )}
      </RoleIndicator>

      {/* Menu Button */}
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          width: 20,
          height: 20
        }}
      >
        <FuseSvgIcon size={12}>heroicons-solid:dots-vertical</FuseSvgIcon>
      </IconButton>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <FuseSvgIcon size={16} sx={{ mr: 1 }}>heroicons-solid:pencil</FuseSvgIcon>
          Edit Person
        </MenuItem>
        <MenuItem onClick={() => handleAction('beneficiary')} disabled={isBeneficiary}>
          <FuseSvgIcon size={16} sx={{ mr: 1 }}>heroicons-solid:user-plus</FuseSvgIcon>
          Set as Beneficiary
        </MenuItem>
        <MenuItem onClick={() => handleAction('executor')} disabled={isExecutor}>
          <FuseSvgIcon size={16} sx={{ mr: 1 }}>heroicons-solid:shield-check</FuseSvgIcon>
          Set as Executor
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <FuseSvgIcon size={16} sx={{ mr: 1 }}>heroicons-solid:trash</FuseSvgIcon>
          Remove Person
        </MenuItem>
      </Menu>
    </NodeContainer>
  );
};

export default BeneficiaryNode;
