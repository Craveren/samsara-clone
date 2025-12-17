import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'lifebook',
    title: 'Lifebook',
    subtitle: 'Your digital legacy story',
    type: 'group',
    icon: 'woodpecker-outline:book',
    translate: 'LIFEBOOK',
    children: [
      {
        id: 'dashboard.overview',
        title: 'Estate Overview',
        type: 'item',
        icon: 'woodpecker-outline:home',
        url: '/dashboard/overview',
      },
      {
        id: 'lifebook.timeline',
        title: 'Life Timeline',
        type: 'item',
        icon: 'woodpecker-outline:timeline',
        url: '/lifebook/timeline',
      },
      {
        id: 'lifebook.estate-health',
        title: 'Estate Health',
        type: 'item',
        icon: 'woodpecker-outline:activity',
        url: '/dashboard/health',
      },
      {
        id: 'lifebook.heat-map',
        title: 'Peck Log',
        type: 'item',
        icon: 'woodpecker-outline:calendar',
        url: '/dashboard/heat-map',
      }
    ],
  },
  {
    id: 'planning',
    title: 'Estate Planning',
    subtitle: 'Secure your legacy',
    type: 'group',
    icon: 'woodpecker-outline:shield',
    translate: 'PLANNING',
    children: [
      {
        id: 'documents.vault',
        title: 'Document Vault',
        type: 'item',
        icon: 'woodpecker-outline:folder',
        url: '/documents/vault',
      },
      {
        id: 'people.beneficiaries',
        title: 'Beneficiaries & Executors',
        type: 'item',
        icon: 'woodpecker-outline:users',
        url: '/people/beneficiaries',
      },
      {
        id: 'planning.wizard',
        title: 'Estate Builder',
        type: 'item',
        icon: 'woodpecker-outline:wrench',
        url: '/planning/wizard',
      },
      {
        id: 'automation.triggers',
        title: 'Automation & Triggers',
        type: 'item',
        icon: 'woodpecker-outline:zap',
        url: '/automation/triggers',
      },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    subtitle: 'Professional estate planning assistance',
    type: 'group',
    icon: 'woodpecker-outline:support',
    translate: 'SERVICES',
    children: [
      {
        id: 'services.education',
        title: 'Estate Education',
        type: 'item',
        icon: 'woodpecker-outline:academic-cap',
        url: '/services/education',
      },
      {
        id: 'services.legal-marketplace',
        title: 'Legal Marketplace',
        type: 'item',
        icon: 'woodpecker-outline:scale',
        url: '/services/legal-marketplace',
      },
      {
        id: 'services.support',
        title: 'Estate Planning Support',
        type: 'item',
        icon: 'woodpecker-outline:question-mark-circle',
        url: '/services/support',
      },
      {
        id: 'services.communication',
        title: 'Executor Communication',
        type: 'item',
        icon: 'woodpecker-outline:chat',
        url: '/services/communication',
        badge: {
          title: '3',
          classes: 'px-8 bg-green-600 text-white rounded-full',
        },
      },
      {
        id: 'services.notifications',
        title: 'Estate Notifications',
        type: 'item',
        icon: 'woodpecker-outline:bell',
        url: '/services/notifications',
        translate: 'NOTIFICATIONS',
        badge: {
          title: '5',
          classes: 'px-8 bg-blue-600 text-white rounded-full',
        },
      },
      {
        id: 'services.directives',
        title: 'Healthcare Directives',
        type: 'item',
        icon: 'woodpecker-outline:document-text',
        url: '/services/directives',
      },
      {
        id: 'services.workflow',
        title: 'Planning Workflow',
        type: 'item',
        icon: 'woodpecker-outline:clipboard-list',
        url: '/services/workflow',
      },
      {
        id: 'services.tasks',
        title: 'Estate Action Items',
        subtitle: '8 remaining tasks',
        type: 'item',
        icon: 'woodpecker-outline:check-circle',
        url: '/services/tasks',
        translate: 'TASKS',
      },
      {
        id: 'services.report',
        title: 'Estate Summary Report',
        type: 'item',
        icon: 'woodpecker-outline:chart-bar',
        url: '/services/report',
      },
    ],
  }
];

export default navigationConfig;
