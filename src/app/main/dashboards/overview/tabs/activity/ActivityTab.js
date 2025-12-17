import { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { selectWidgets } from '../../store/widgetsSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function ActivityTab() {
  const widgets = useSelector(selectWidgets);
  const [activeFilter, setActiveFilter] = useState('all');

  if (!widgets) {
    return null;
  }

  const activities = [
    {
      id: 1,
      type: 'document',
      title: 'Will document updated',
      description: 'Last will and testament updated with beneficiary info',
      timestamp: '2 hours ago',
      icon: 'woodpecker-outline:document',
      color: 'green'
    },
    {
      id: 2,
      type: 'beneficiary',
      title: 'Beneficiary added: Emily Johnson with 25% allocation',
      description: '',
      timestamp: '1 day ago',
      icon: 'woodpecker-outline:user-plus',
      color: 'blue'
    },
    {
      id: 3,
      type: 'executor',
      title: 'Executor nominated: John Smith',
      description: '',
      timestamp: '3 days ago',
      icon: 'woodpecker-outline:user-check',
      color: 'purple'
    },
    {
      id: 4,
      type: 'task',
      title: 'Task completed: Healthcare directive filled out',
      description: '',
      timestamp: '1 week ago',
      icon: 'woodpecker-outline:check-circle',
      color: 'yellow'
    },
    {
      id: 5,
      type: 'task',
      title: 'Annual estate plan review reminder',
      description: '',
      timestamp: '2 weeks ago',
      icon: 'woodpecker-outline:calendar',
      color: 'orange'
    }
  ];

  const filteredActivities = activeFilter === 'all'
    ? activities
    : activities.filter(activity => activity.type === activeFilter);

  const handleFilterChange = (event, newValue) => {
    setActiveFilter(newValue);
  };

  return (
    <div className="flex flex-col flex-auto space-y-24">
      {/* Recent Activity Header */}
      <div className="px-24 py-16 bg-white border-b border-gray-200">
        <Typography className="text-xl font-semibold">
          Recent Activity
        </Typography>
      </div>

      {/* Filter Tabs */}
      <div className="px-24">
        <Tabs
          value={activeFilter}
          onChange={handleFilterChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons={false}
          className="border-b border-gray-200"
        >
          <Tab label="All" value="all" />
          <Tab label="Documents" value="document" />
          <Tab label="Beneficiaries" value="beneficiary" />
          <Tab label="Executors" value="executor" />
          <Tab label="Tasks" value="task" />
        </Tabs>
      </div>

      {/* Timeline List */}
      <div className="px-24 space-y-16">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-16">
            <div className="flex flex-col items-center">
              <FuseSvgIcon size={20} color="action" className="mb-4">
                heroicons-solid:clock
              </FuseSvgIcon>
            </div>

            <div className="flex-1 pb-16 border-l-2 border-gray-200 pl-16">
              <Typography className="text-sm text-gray-500 mb-2">
                {activity.timestamp}
              </Typography>
              <Typography className="font-medium text-gray-900 mb-1">
                - {activity.title}
              </Typography>
              {activity.description && (
                <Typography className="text-sm text-gray-600">
                  {activity.description}
                </Typography>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Summary */}
      <div className="px-24">
        <Typography className="text-lg font-semibold mb-16">
          Monthly Summary
        </Typography>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-16 rounded-lg text-center border border-gray-200">
            <Typography className="text-2xl font-bold text-gray-900">24</Typography>
            <Typography className="text-sm text-gray-600">Activities</Typography>
          </Card>

          <Card className="p-16 rounded-lg text-center border border-gray-200">
            <Typography className="text-2xl font-bold text-gray-900">12</Typography>
            <Typography className="text-sm text-gray-600">Documents</Typography>
          </Card>

          <Card className="p-16 rounded-lg text-center border border-gray-200">
            <Typography className="text-2xl font-bold text-gray-900">3</Typography>
            <Typography className="text-sm text-gray-600">Beneficiaries</Typography>
          </Card>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-24">
        <TextField
          fullWidth
          placeholder="Search activities..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FuseSvgIcon size={20} color="action">
                  heroicons-solid:search
                </FuseSvgIcon>
              </InputAdornment>
            ),
          }}
          className="bg-white"
        />
      </div>
    </div>
  );
}

export default ActivityTab;
