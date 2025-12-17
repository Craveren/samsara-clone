import LifebookTimelineAppConfig from './lifebook/LifebookTimelineAppConfig';
import DocumentVaultAppConfig from './documents/DocumentVaultAppConfig';
import BeneficiariesAppConfig from './beneficiaries/BeneficiariesAppConfig';
import EstateWizardAppConfig from './wizard/EstateWizardAppConfig';
import AutomationTriggersAppConfig from './automation/AutomationTriggersAppConfig';
import EstateEducationAppConfig from './education/EstateEducationAppConfig';
import LegalMarketplaceAppConfig from './marketplace/LegalMarketplaceAppConfig';
import EstateSupportAppConfig from './support/EstateSupportAppConfig';
import ExecutorCommunicationAppConfig from './communication/ExecutorCommunicationAppConfig';
import EstateNotificationsAppConfig from './notifications/EstateNotificationsAppConfig';
import HealthcareDirectivesAppConfig from './directives/HealthcareDirectivesAppConfig';
import PlanningWorkflowAppConfig from './workflow/PlanningWorkflowAppConfig';
import EstateTasksAppConfig from './tasks/EstateTasksAppConfig';
import EstateReportAppConfig from './report/EstateReportAppConfig';

const woodpeckerServiceConfigs = [
  LifebookTimelineAppConfig,
  DocumentVaultAppConfig,
  BeneficiariesAppConfig,
  EstateWizardAppConfig,
  AutomationTriggersAppConfig,
  EstateEducationAppConfig,
  LegalMarketplaceAppConfig,
  EstateSupportAppConfig,
  ExecutorCommunicationAppConfig,
  EstateNotificationsAppConfig,
  HealthcareDirectivesAppConfig,
  PlanningWorkflowAppConfig,
  EstateTasksAppConfig,
  EstateReportAppConfig,
];

export default woodpeckerServiceConfigs;
