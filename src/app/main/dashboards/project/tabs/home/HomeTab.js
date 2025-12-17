import { motion } from 'framer-motion';
import SummaryWidget from './widgets/SummaryWidget';
import OverdueWidget from './widgets/OverdueWidget';
import IssuesWidget from './widgets/IssuesWidget';
import FeaturesWidget from './widgets/FeaturesWidget';
import GithubIssuesWidget from './widgets/GithubIssuesWidget';
import TaskDistributionWidget from './widgets/TaskDistributionWidget';
import ScheduleWidget from './widgets/ScheduleWidget';
import DrivenDistance from './widgets/DrivenDistance';
import AvgHour from './widgets/AvgHour';
import FuelUsedVsWasted from './widgets/FuelUsedVsWasted';
import AvgViolation from './widgets/AvgViolation';
import FuelEfficency from './widgets/FuelEfficency';
import IdleHours from './widgets/IdleHours';

function HomeTab() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-24 w-full min-w-0 p-24"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <SummaryWidget />
      </motion.div>
      <motion.div variants={item}>
        <FeaturesWidget />
      </motion.div>
      <motion.div variants={item}>
        <IssuesWidget />
      </motion.div>
      <motion.div variants={item}>
        <OverdueWidget />
      </motion.div>
      <motion.div variants={item} className="sm:col-span-4 md:col-span-2 lg:col-span-2">
        <DrivenDistance/>
      </motion.div>
      <motion.div variants={item} className="sm:col-span-4 md:col-span-2 lg:col-span-2">
        <AvgHour/>
      </motion.div>
      <motion.div variants={item} className="sm:col-span-4 md:col-span-2 lg:col-span-2">
        <FuelUsedVsWasted/>
      </motion.div>
      <motion.div variants={item} className="sm:col-span-4 md:col-span-2 lg:col-span-2">
        <AvgViolation/>
      </motion.div>
      <motion.div variants={item} className="sm:col-span-4 md:col-span-2 lg:col-span-2">
        <FuelEfficency/>
      </motion.div>
      <motion.div variants={item} className="sm:col-span-4 md:col-span-2 lg:col-span-2">
        <IdleHours/>
      </motion.div>
      {/* <motion.div variants={item} className="sm:col-span-2 md:col-span-4">
        <GithubIssuesWidget />
      </motion.div> */}
      {/* <motion.div variants={item} className="sm:col-span-2 md:col-span-4 lg:col-span-2">
        <TaskDistributionWidget />
      </motion.div> */}
      <motion.div variants={item} className="sm:col-span-4 md:col-span-4 lg:col-span-4">
        <ScheduleWidget />
      </motion.div>
    </motion.div>
  );
}

export default HomeTab;
