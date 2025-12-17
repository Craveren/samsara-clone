import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectWidgets } from '../../../store/widgetsSlice';
import { Button } from '@mui/material';

function GithubIssuesWidget() {
  const theme = useTheme();
  const [awaitRender, setAwaitRender] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const widgets = useSelector(selectWidgets);
  const { charts, series,ranges,labels} = widgets?.AverageDistanceDriven;
  const currentRange = Object.keys(ranges)[tabValue];
  console.log("hihi",charts.data);

  const chartOptions = {
    chart: {
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'bar', // Set the chart type to 'bar'
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.secondary.main],
    labels,
    dataLabels: {
      enabled: true,
      enabledOnSeries: [], // Set to empty array to disable data labels
      background: {
        borderWidth: 0,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.75,
        },
      },
    },
    stroke: {
      width: 0, // Set line width to 0 to remove the line
    },
    tooltip: {
      followCursor: true,
      theme: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: theme.palette.divider,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: -16,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
  

  // const chartOptions = {
  //   chart: {
  //     fontFamily: 'inherit',
  //     foreColor: 'inherit',
  //     height: '100%',
  //     type: 'line',
  //     toolbar: {
  //       show: false,
  //     },
  //     zoom: {
  //       enabled: false,
  //     },
  //   },
  //   colors: [theme.palette.secondary.main],
  //   labels,
  //   dataLabels: {
  //     enabled: true,
  //     enabledOnSeries: [0],
  //     background: {
  //       borderWidth: 0,
  //     },
  //   },
  //   grid: {
  //     borderColor: theme.palette.divider,
  //   },
  //   legend: {
  //     show: false,
  //   },
  //   plotOptions: {
  //     bar: {
  //       columnWidth: '50%',
  //     },
     
  //   },
  //   states: {
  //     hover: {
  //       filter: {
  //         type: 'darken',
  //         value: 0.75,
  //       },
  //     },
  //   },
  //   stroke: {
  //     width: [3, 0],
  //   },
  //   tooltip: {
  //     followCursor: true,
  //     theme: theme.palette.mode,
  //   },
  //   xaxis: {
  //     axisBorder: {
  //       show: false,
  //     },
  //     axisTicks: {
  //       color: theme.palette.divider,
  //     },
  //     labels: {
  //       style: {
  //         colors: theme.palette.text.secondary,
  //       },
  //     },
  //     tooltip: {
  //       enabled: false,
  //     },
  //   },
  //   yaxis: {
  //     labels: {
  //       offsetX: -16,
  //       style: {
  //         colors: theme.palette.text.secondary,
  //       },
  //     },
  //   },
  // };

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  if (awaitRender) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden w-full">
      <div className="flex flex-col sm:flex-row items-start justify-between w-full">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          Avg Distance Driven
        </Typography>
        {/* <div className="mt-12 sm:mt-0 sm:ml-8">
          <Tabs
            value={tabValue}
            onChange={(ev, value) => setTabValue(value)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="-mx-4 min-h-40"
            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
            TabIndicatorProps={{
              children: (
                <Box
                  sx={{ bgcolor: 'text.disabled' }}
                  className="w-full h-full rounded-full opacity-20"
                />
              ),
            }}
          >
            {Object.entries(ranges).map(([key, label]) => (
              <Tab
                className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                disableRipple
                key={key}
                label={label}
              />
            ))}
          </Tabs>
        </div> */}
      </div>
        {/* chart */}
      <div className="grid grid-cols-1 sm:grid-col-2 lg:grid-cols-1 grid-flow-row gap-24 w-full mt-32 sm:mt-16">
        <div className="flex flex-col flex-auto">
          <Typography className="font-large text-center" color="text.secondary">
            {}
          </Typography>
          <div className="flex flex-col flex-auto">
            <ReactApexChart
              className="flex-auto w-full"
              options={chartOptions}
              series={series[currentRange]}
              height={320}
            />
          </div>
        </div>
        {/* <div className="flex flex-col">
          <Typography className="font-medium" color="text.secondary">
            Overview
          </Typography>
          <div className="flex-auto grid grid-cols-4 gap-16 mt-24">
            <div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-indigo-50 text-indigo-800">
              <Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['new-issues']}
              </Typography>
              <Typography className="mt-4 text-sm sm:text-lg font-medium">New Issues</Typography>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-green-50 text-green-800">
              <Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['closed-issues']}
              </Typography>
              <Typography className="mt-4 text-sm sm:text-lg font-medium">Closed</Typography>
            </div>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange].fixed}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Fixed</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['wont-fix']}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Won't Fix</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['re-opened']}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Re-opened</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['needs-triage']}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Needs Triage</Typography>
            </Box>
          </div>
        </div> */}
      </div>
      <div className="grid grid-cols-3 my-12" style={{justifyContent:"center"}}>
      <div className="flex items-center" style={{justifyContent:"center"}}>
        <Box
          className="flex-0 w-8 h-8 rounded-full"
          sx={{backgroundColor:"blue"}}
        />
        <Typography className="ml-12 truncate">Label</Typography>
      </div>
      <Typography className="font-medium text-center">
        10:00
      </Typography>
      <Typography className="text-center" color="text.secondary">
       20%
      </Typography>
    </div>
      <div className="grid grid-cols-3 py-12" style={{justifyContent:"center"}}>
      <div className="flex items-center" style={{justifyContent:"center"}}>
        <Box
          className="flex-0 w-8 h-8 rounded-full"
          sx={{backgroundColor:"blue"}}
        />
        <Typography className="ml-12 truncate">Label</Typography>
      </div>
      <Typography className="font-medium text-center">
        10:00
      </Typography>
      <Typography className="text-center" color="text.secondary">
       20%
      </Typography>
    </div>
      <div className="grid grid-cols-3 py-12" style={{justifyContent:"center"}}>
      <div className="flex items-center" style={{justifyContent:"center"}}>
        <Box
          className="flex-0 w-8 h-8 rounded-full"
          sx={{backgroundColor:"blue"}}
        />
        <Typography className="ml-12 truncate">Label</Typography>
      </div>
      <Typography className="font-medium text-center">
        10:00
      </Typography>
      <Typography className="text-center" color="text.secondary">
       20%
      </Typography>
    </div>
    <Button
           sx={{width:"40%",left:"60%"}}
            variant="contained"
            color="secondary"     
          >
            More Details
          </Button>
    </Paper>
  );
}

export default memo(GithubIssuesWidget);
