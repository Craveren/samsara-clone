import withReducer from 'app/store/withReducer';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import AnalyticsDashboardAppHeader from './AnalyticsDashboardAppHeader';
import VisitorsOverviewWidget from './widgets/VisitorsOverviewWidget';
import ConversionsWidget from './widgets/ConversionsWidget';
import ImpressionsWidget from './widgets/ImpressionsWidget';
import VisitsWidget from './widgets/VisitsWidget';
import VisitorsVsPageViewsWidget from './widgets/VisitorsVsPageViewsWidget';
import NewVsReturningWidget from './widgets/NewVsReturningWidget';
import AgeWidget from './widgets/AgeWidget';
import LanguageWidget from './widgets/LanguageWidget';
import GenderWidget from './widgets/GenderWidget';
import SummarySection from './widgets/SummarySection';
import ProgressBar from './widgets/ProgressBar';
import RemainingCriteria from './widgets/RemainingCriteria';
import TransictionTable from './widgets/TransictionTable';

function AnalyticsDashboardApp() {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  return (
    <FusePageSimple
      header={<AnalyticsDashboardAppHeader />}
      content={
        <>
          {useMemo(() => {
            const container = {
              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            };

            const item = {
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            };

            return (
              !_.isEmpty(widgets) && (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 w-full p-24 md:p-32"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                 
                <motion.div variants={item} className="sm:col-span-2 lg:col-span-1" style={{display:"flex",justifyContent:"center"}}>
                    <SummarySection />
                  </motion.div>
                 <motion.div variants={item} className="sm:col-span-2 lg:col-span-2 flex flex-row gap-20" style={{alignItems:"center",justifyContent:"center"}}>
                 
                 <ProgressBar />
                    <RemainingCriteria />
                  </motion.div>
                  
                 

                  <div className="w-full mt-16 sm:col-span-3">
                    <Typography className="text-3xl font-semibold tracking-tight leading-6">
                      Details 
                    </Typography>
                  </div>
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-4">
                    <TransictionTable />
                  </motion.div>
                  
                </motion.div>
              )
            );
          }, [widgets])}
        </>
      }
    />
  );
}

export default withReducer('analyticsDashboardApp', reducer)(AnalyticsDashboardApp);