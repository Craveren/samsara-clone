import EstateOverviewAppConfig from './overview/EstateOverviewAppConfig';
import EstateHealthAppConfig from './health/EstateHealthAppConfig';
import BeneficiaryAllocationAppConfig from './allocation/BeneficiaryAllocationAppConfig';
import PeckLogAppConfig from './peck-log/PeckLogAppConfig';
import MemoriesTimelineAppConfig from './memories/MemoriesTimelineAppConfig';

const woodpeckerDashboardConfigs = [
  EstateOverviewAppConfig,
  EstateHealthAppConfig,
  BeneficiaryAllocationAppConfig,
  PeckLogAppConfig,
  MemoriesTimelineAppConfig,
];

export default dashboardsConfigs;
