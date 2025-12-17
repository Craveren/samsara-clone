import withReducer from 'app/store/withReducer';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import FinanceDashboardAppHeader from './FinanceDashboardAppHeader';
import PreviousStatementWidget from './widgets/PreviousStatementWidget';
import CurrentStatementWidget from './widgets/CurrentStatementWidget';
import AccountBalanceWidget from './widgets/AccountBalanceWidget';
import RecentTransactionsWidget from './widgets/RecentTransactionsWidget';
import BudgetWidget from './widgets/BudgetWidget';
import { Typography } from '@mui/material';

function FinanceDashboardApp() {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  return (
    <FusePageSimple
      header={<FinanceDashboardAppHeader />}
      content={
        <div className="w-full px-24 md:px-32 pb-24">
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
                <motion.div className="w-full" variants={container} initial="hidden" animate="show">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-32 w-full mt-32">
                  <motion.div variants={item} className="flex flex-col flex-auto">
                  <AccountBalanceWidget />
                </motion.div>
                    <motion.div variants={item} className="flex flex-col flex-auto">
                      <BudgetWidget />
                    </motion.div>
                    
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-32 w-full mt-32">
                  <Typography className="text-3xl font-semibold tracking-tight leading-8">
                  Drivers 
                </Typography>
                    <motion.div variants={item} className="xl:col-span-2 flex flex-col flex-auto">
                      <RecentTransactionsWidget />
                    </motion.div>
                    
                  </div>
                </motion.div>
              )
            );
          }, [widgets])}
        </div>
      }
    />
  
  // <h1>Hello World</h1>
    );
}

export default withReducer('financeDashboardApp', reducer)(FinanceDashboardApp);
