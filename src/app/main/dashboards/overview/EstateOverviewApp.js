import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useState, lazy, Suspense, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import EstateOverviewAppHeader from './EstateOverviewAppHeader';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import { InlineLoader } from 'app/shared-components/LoadingSpinner';
import ErrorBoundary from 'app/shared-components/ErrorBoundary';

// Lazy load tabs for better performance
const OverviewTab = lazy(() => import('./tabs/overview/OverviewTab'));
const AnalyticsTab = lazy(() => import('./tabs/analytics/AnalyticsTab'));
const ActivityTab = lazy(() => import('./tabs/activity/ActivityTab'));

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

const EstateOverviewApp = memo(function EstateOverviewApp(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  const handleChangeTab = useMemo(
    () => (event, value) => {
      setTabValue(value);
    },
    []
  );

  const tabContent = useMemo(() => {
    switch (tabValue) {
      case 0:
        return (
          <Suspense fallback={<InlineLoader message="Loading overview..." />}>
            <ErrorBoundary>
              <OverviewTab />
            </ErrorBoundary>
          </Suspense>
        );
      case 1:
        return (
          <Suspense fallback={<InlineLoader message="Loading analytics..." />}>
            <ErrorBoundary>
              <AnalyticsTab />
            </ErrorBoundary>
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<InlineLoader message="Loading activity..." />}>
            <ErrorBoundary>
              <ActivityTab />
            </ErrorBoundary>
          </Suspense>
        );
      default:
        return null;
    }
  }, [tabValue]);

  if (_.isEmpty(widgets)) {
    return <InlineLoader message="Loading widgets..." />;
  }

  return (
    <Root
      header={<EstateOverviewAppHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="w-full px-24 -mx-4 min-h-40"
            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
            TabIndicatorProps={{
              children: (
                <Box
                  sx={{ bgcolor: 'text.disabled' }}
                  className="w-full h-full rounded-full opacity-20"
                />
              ),
            }}
            aria-label="Estate overview tabs"
          >
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Overview"
              aria-controls="overview-tabpanel"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Analytics"
              aria-controls="analytics-tabpanel"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Activity"
              aria-controls="activity-tabpanel"
            />
          </Tabs>
          <div role="tabpanel" aria-labelledby={`tab-${tabValue}`}>
            {tabContent}
          </div>
        </div>
      }
    />
  );
});

export default withReducer('estateOverviewApp', reducer)(EstateOverviewApp);
