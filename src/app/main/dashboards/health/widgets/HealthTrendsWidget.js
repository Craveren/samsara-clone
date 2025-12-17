import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { selectEstateHealth } from '../store/estateHealthSlice';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';

function HealthTrendsWidget() {
  const estateHealth = useSelector(selectEstateHealth);

  // Sample trend data - in real app this would come from API
  const trendData = [
    { month: 'Oct 2023', score: 65, documents: 8, tasks: 45 },
    { month: 'Nov 2023', score: 70, documents: 9, tasks: 52 },
    { month: 'Dec 2023', score: 75, documents: 11, tasks: 58 },
    { month: 'Jan 2024', score: 78, documents: 12, tasks: 62 },
    { month: 'Feb 2024', score: estateHealth?.overallHealthScore || 78, documents: 12, tasks: 65 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 3
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" color={entry.color}>
              {entry.name}: {entry.value}{entry.name === 'Health Score' ? '%' : ''}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <WoodpeckerCard>
      <Box p={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Health Trends
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Estate health score progression over time
        </Typography>

        <Box height={300} mt={3}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={3}
                name="Health Score"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Trend Summary */}
        <Box mt={3} pt={2} borderTop={1} borderColor="divider">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" fontWeight="medium">
                6-Month Trend
              </Typography>
              <Typography variant="caption" color="text.secondary">
                +13 points improvement
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" fontWeight="medium" color="success.main">
                Trending Upward
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Consistent progress
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </WoodpeckerCard>
  );
}

export default HealthTrendsWidget;
