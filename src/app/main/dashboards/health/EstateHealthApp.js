import withReducer from 'app/store/withReducer';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import EstateHealthAppHeader from './EstateHealthAppHeader';
import EstateVitalsWidget from './widgets/EstateVitalsWidget';
import DocumentHealthWidget from './widgets/DocumentHealthWidget';
import BeneficiaryStatusWidget from './widgets/BeneficiaryStatusWidget';
import TaskProgressWidget from './widgets/TaskProgressWidget';
import RiskAlertsWidget from './widgets/RiskAlertsWidget';
import HealthTrendsWidget from './widgets/HealthTrendsWidget';
import CompletionMetricsWidget from './widgets/CompletionMetricsWidget';

function EstateHealthApp() {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  return (
    <FusePageSimple
      header={<EstateHealthAppHeader />}
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
                  {/* Estate Vitals - ICU Style Monitoring */}
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-3">
                    <EstateVitalsWidget />
                  </motion.div>

                  {/* Document Health Status */}
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
                    <DocumentHealthWidget />
                  </motion.div>

                  {/* Beneficiary Status */}
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
                    <BeneficiaryStatusWidget />
                  </motion.div>

                  {/* Task Progress */}
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
                    <TaskProgressWidget />
                  </motion.div>

                  {/* Risk Alerts - Critical Issues */}
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-3">
                    <RiskAlertsWidget />
                  </motion.div>

                  {/* Health Trends Over Time */}
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-2">
                    <HealthTrendsWidget />
                  </motion.div>

                  {/* Completion Metrics */}
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
                    <CompletionMetricsWidget />
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

export default withReducer('estateHealthApp', reducer)(EstateHealthApp);
