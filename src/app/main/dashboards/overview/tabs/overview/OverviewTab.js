import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { selectWidgets } from '../../store/widgetsSlice';
import { selectEstateStatus } from '../../store/estateStatusSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/userSlice';
import './OverviewTab.scss';

function OverviewTab() {
  const widgets = useSelector(selectWidgets);
  const estateStatus = useSelector(selectEstateStatus);
  const user = useSelector(selectUser);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load amCharts scripts
    const loadAmCharts = () => {
      if (window.am5) {
        setTimeout(initChart, 100);
        return;
      }

      // Load scripts in order
      const scripts = [
        'https://cdn.amcharts.com/lib/5/index.js',
        'https://cdn.amcharts.com/lib/5/xy.js',
        'https://cdn.amcharts.com/lib/5/themes/Animated.js'
      ];

      let loadedCount = 0;
      const checkAndLoad = () => {
        if (loadedCount === scripts.length) {
          setTimeout(initChart, 100);
        }
      };

      scripts.forEach(src => {
        if (!document.querySelector(`script[src="${src}"]`)) {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            loadedCount++;
            checkAndLoad();
          };
          script.onerror = () => {
            loadedCount++;
            checkAndLoad();
          };
          document.head.appendChild(script);
        } else {
          loadedCount++;
          checkAndLoad();
        }
      });
    };

    loadAmCharts();

    // Handle resize
    const handleResize = () => {
      if (window.am5 && chartRef.current?.chart) {
        chartRef.current.chart.root.invalidate();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup chart on unmount
      if (chartRef.current?.chart) {
        chartRef.current.chart.dispose();
        chartRef.current.chart = null;
      }
    };
  }, []);

  // Progress Strip Functionality
  useEffect(() => {
    const fill = document.getElementById("estateProgressFill");
    const text = document.getElementById("estateProgressText");
    const stepsContainer = document.getElementById("estateProgressSteps");

    if (!fill || !text || !stepsContainer) return;

    const steps = Array.from(stepsContainer.querySelectorAll(".estate-step"));

    // Load saved progress or derive from completion
    const completionFromState = estateStatus?.completionPercentage || 85;
    const stored = Number(localStorage.getItem("estateTopProgress") || completionFromState);
    let currentTarget = Math.min(Math.max(stored, 0), 100);

    const animateTo = (target) => {
      const startWidth = parseFloat(fill.style.width) || 0;
      const startTime = performance.now();
      const duration = 800;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const frame = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = startWidth + (target - startWidth) * easeOut(t);
        const value = Math.round(eased);

        fill.style.width = `${value}%`;
        text.textContent = `${value}%`;

        steps.forEach(step => {
          const stepValue = Number(step.dataset.progress);
          step.classList.toggle("completed", stepValue <= value + 0.5);
        });

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          localStorage.setItem("estateTopProgress", String(target));
        }
      };

      requestAnimationFrame(frame);
    };

    // Initial animation
    requestAnimationFrame(() => animateTo(currentTarget));

    // Click handlers for step navigation
    steps.forEach(step => {
      step.onclick = () => {
        const targetProgress = Number(step.dataset.progress);
        const sectionId = step.dataset.target;
        currentTarget = targetProgress;
        animateTo(targetProgress);

        if (sectionId) {
          const el = document.querySelector(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    });
  }, [estateStatus?.completionPercentage]);

  const initChart = () => {
    if (!chartRef.current || !window.am5) return;

    // Dispose existing chart if any
    if (chartRef.current.chart) {
      chartRef.current.chart.dispose();
      chartRef.current.chart = null;
    }

    // Find the chart container element
    const chartElement = document.getElementById("estateValueChart");
    if (!chartElement) {
      if (process.env.NODE_ENV === 'development') {
      console.warn('Chart container not found');
      }
      return;
    }

    const root = window.am5.Root.new(chartElement);

    // Set themes
    const myTheme = window.am5.Theme.new(root);
    myTheme.rule("AxisLabel", ["minor"]).setAll({
      dy:1
    });

    myTheme.rule("Grid", ["minor"]).setAll({
      strokeOpacity: 0.08
    });

    root.setThemes([
      window.am5themes_Animated.new(root),
      myTheme
    ]);

    // Create chart
    const chart = root.container.children.push(window.am5xy.XYChart.new(root, {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      maxTooltipDistance: 0,
      pinchZoomX: true,
      layout: root.verticalLayout
    }));

    // Create axes
    const xAxis = chart.xAxes.push(window.am5xy.DateAxis.new(root, {
      maxDeviation: 0.2,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: window.am5xy.AxisRendererX.new(root, {}),
      tooltip: window.am5.Tooltip.new(root, {})
    }));

    const yAxis = chart.yAxes.push(window.am5xy.ValueAxis.new(root, {
      renderer: window.am5xy.AxisRendererY.new(root, {
        opposite: false
      }),
      tooltip: window.am5.Tooltip.new(root, {})
    }));

    // Create series
    const series = chart.series.push(window.am5xy.LineSeries.new(root, {
      name: "Estate Value",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: window.am5.Tooltip.new(root, {
        labelText: "{valueY.formatNumber('#,###')}"
      })
    }));

    series.fills.template.setAll({
      fillOpacity: 0.15,
      visible: true,
      fill: '#10B981'
    });

    series.strokes.template.setAll({
      strokeWidth: 3,
      stroke: '#10B981'
    });

    // Generate mock data (12 months of weekly data)
    const data = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    let currentValue = 950000; // Start value

    for (let i = 0; i < 52; i++) { // 52 weeks = 12 months
      const date = new Date(startDate);
      date.setDate(date.getDate() + (i * 7)); // Weekly intervals

      // Add some realistic variation (±5%)
      const variation = (Math.random() - 0.5) * 0.1;
      currentValue = currentValue * (1 + variation);

      // Ensure value stays within reasonable bounds
      currentValue = Math.max(800000, Math.min(1300000, currentValue));

      data.push({
        date: date.getTime(),
        value: Math.round(currentValue)
      });
    }

    // Set final value to match snapshot
    data[data.length - 1].value = 1175000;

    series.data.setAll(data);

    // Add cursor for interactivity
    const cursor = chart.set("cursor", window.am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", true);
    cursor.lineX.set("visible", true);

    // Add scrollbar for navigation
    const scrollbar = chart.set("scrollbarX", window.am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50
    }));
    scrollbar.series.push(series);

    // Make chart responsive
    root.resize();

    // Store chart reference for cleanup
    chartRef.current.chart = root;

    // Make chart responsive
    root.resize();
  };

  if (!widgets) {
    return null;
  }

  const totalEstateValue = 1175000; // From Redux or calculation
  const completionPercentage = estateStatus?.completionPercentage || 85;
  const completedTasks = estateStatus?.completedTasks || 12;
  const totalTasks = estateStatus?.totalTasks || 14;
  const riskLevel = estateStatus?.riskLevel || 'medium';
  const criticalAlerts = estateStatus?.criticalAlerts || 2;
  const warnings = estateStatus?.warnings || 3;
  const healthScore = estateStatus?.healthScore || 78;

  return (
    <div className="overview-container">
      {/* Top Bar (Unchanged) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between px-24 py-12 bg-white border-b border-gray-200">
          <div className="flex flex-col">
            <Typography className="text-2xl font-semibold leading-tight">
              Welcome back, {user?.data?.displayName || 'User'}!
            </Typography>
            <Typography className="text-sm text-gray-600 mt-1 leading-tight">
              You have 2 new notifications and 8 estate tasks
            </Typography>
          </div>
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg"
              onClick={() => navigate('/notifications')}
            >
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:bell
              </FuseSvgIcon>
              <Typography className="text-sm font-medium">2</Typography>
            </div>
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg"
              onClick={() => navigate('/profile')}
            >
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:cog
              </FuseSvgIcon>
            </div>
          </div>
        </div>

        {/* Estate Overview Section Header */}
        <div className="px-24 py-16 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Typography className="text-xl font-bold text-gray-900">
              Estate Overview
            </Typography>
            <Typography className="text-sm text-gray-500 font-medium">
              Last updated: Today
            </Typography>
          </div>
          <Typography className="text-sm text-gray-600">
            Your command center for estate progress and financial health.
          </Typography>
        </div>

        {/* Estate Progress Strip */}
        <section className="estate-progress-strip">
          <Typography className="text-sm font-medium text-gray-700 mb-2 text-center">
            Estate completion: {estateStatus?.completionPercentage || 85}% • {
              (estateStatus?.completionPercentage || 85) >= 80 ? 'Almost there' :
              (estateStatus?.completionPercentage || 85) >= 50 ? 'Making progress' : 'Off to a good start'
            }
          </Typography>

          <div className="estate-progress-steps" id="estateProgressSteps">
            <button className="estate-step" data-target="#estateValueSection" data-progress="25">
              <span className="estate-step-label">1. Value trend</span>
            </button>
            <button className="estate-step" data-target="#snapshotSection" data-progress="45">
              <span className="estate-step-label">2. Snapshot</span>
            </button>
            <button className="estate-step" data-target="#healthSection" data-progress="75">
              <span className="estate-step-label">3. Health & alerts</span>
            </button>
            <button className="estate-step" data-target="#actionsSection" data-progress="100">
              <span className="estate-step-label">4. Actions</span>
            </button>
          </div>

          <div className="estate-progress-bar">
            <div className="estate-progress-fill" id="estateProgressFill">
              <span className="estate-progress-text" id="estateProgressText">0%</span>
            </div>
          </div>
        </section>
      </motion.div>

      {/* ROW 1: Estate Value Trend + Snapshot */}
      <section id="estateValueSection" className="estate-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overview-row-1"
        >
          <div className="overview-grid">
          {/* Estate Value Trend Card (75% width) */}
          <Card className="estate-value-trend-card">
            <Box className="p-24 estate-trend-content">
              <Typography className="text-xl font-semibold mb-8">
                Estate Value Trend
              </Typography>
              <Typography className="text-sm text-gray-600 mb-16">
                Interactive estate value over the past year.
              </Typography>
              <div
                id="estateValueChart"
                ref={chartRef}
                className="estate-chart-container"
                style={{ minHeight: '360px', width: '100%' }}
              />
            </Box>
          </Card>

          {/* Estate Snapshot Card (25% width) */}
          <Card id="snapshotSection" className="estate-snapshot-card estate-section">
            <Box className="p-20">
              <Typography className="text-xl font-semibold mb-16">
                Estate Snapshot
              </Typography>

              <div className="snapshot-stats">
                {/* Total Value - Highlighted */}
                <div className="snapshot-stat-row snapshot-value-row">
                  <Typography className="text-sm text-gray-600 font-medium">
                    Total estate value
                  </Typography>
                  <Typography className="text-2xl font-bold text-green-600">
                    ${totalEstateValue.toLocaleString()}
                  </Typography>
                </div>

                {/* Completion */}
                <div className="snapshot-stat-row">
                  <Typography className="text-sm text-gray-600">
                    Completion
                  </Typography>
                  <Typography className="text-base font-semibold">
                    {completionPercentage}% • {completedTasks}/{totalTasks}
                  </Typography>
                </div>

                {/* Risk Level */}
                <div className="snapshot-stat-row">
                  <Typography className="text-sm text-gray-600">
                    Risk level
                  </Typography>
                  <Typography className={`text-base font-semibold capitalize ${
                    riskLevel === 'high' ? 'text-red-600' :
                    riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {riskLevel}
                  </Typography>
                </div>

                {/* Alerts */}
                <div className="snapshot-stat-row">
                  <Typography className="text-sm text-gray-600">
                    Alerts
                  </Typography>
                  <Typography className="text-base font-semibold">
                    {criticalAlerts} critical • {warnings} warnings
                  </Typography>
                </div>

                {/* Next Step & CTA */}
                <div className="snapshot-cta-section">
                  <Typography className="text-sm text-gray-600 mb-2">
                    Next key step
                  </Typography>
                  <Typography className="text-sm font-medium mb-12">
                    Nominate an executor
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="snapshot-cta-button"
                    onClick={() => {
                      navigate('/people/beneficiaries');
                    }}
                  >
                    Nominate executor
                  </Button>
                </div>
              </div>
            </Box>
          </Card>
        </div>
        </motion.div>
      </section>

      {/* ROW 2: Financial Cheat Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="financial-cheat-sheet-card">
          <Box className="p-24">
            <Typography className="text-xl font-semibold mb-8">
              Financial Cheat Sheet
            </Typography>
            <Typography className="text-sm text-gray-600 mb-20">
              Quick signals to guide your next move.
            </Typography>

            <div className="cheat-sheet-grid">
              <div className="cheat-sheet-metrics">
                <Typography className="text-sm text-gray-700 mb-8">
                  • Liquidity runway: <span className="font-semibold text-green-600">6.2 months</span> at current spending
                </Typography>
                <Typography className="text-sm text-gray-700 mb-8">
                  • Savings rate: <span className="font-semibold text-green-600">24%</span> of monthly inflows
                </Typography>
                <Typography className="text-sm text-gray-700 mb-8">
                  • Debt-to-asset ratio: <span className="font-semibold text-green-600">0.00</span> (no debt linked)
                </Typography>
                <Typography className="text-sm text-gray-700 mb-8">
                  • Estate diversification: <span className="font-semibold text-blue-600">3 major asset classes</span>
                </Typography>
              </div>

              <div className="cheat-sheet-insights">
                <Typography className="text-sm text-gray-700 mb-8">
                  • Biggest driver: <span className="font-semibold">Real estate (38% of value)</span>
                </Typography>
                <Typography className="text-sm text-gray-700 mb-8">
                  • Most vulnerable: <span className="font-semibold text-amber-600">Bank balance if spending > $2.4k/month</span>
                </Typography>
                <Typography className="text-sm text-gray-700">
                  • Suggested move this month: <span className="font-semibold text-blue-600">Top up retirement by $3k</span>
                </Typography>
              </div>
            </div>
          </Box>
        </Card>
      </motion.div>

      {/* ROW 3: Estate Update & Health */}
      <section id="healthSection" className="estate-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="estate-health-card">
          <Box className="p-24">
            <Typography className="text-xl font-semibold mb-20">
              Estate Update & Health
            </Typography>

            <div className="health-sections">
              {/* Completion & tasks */}
              <div className="health-section">
                <Typography className="text-base font-bold mb-8 text-gray-900">
                  Completion & tasks
                </Typography>
                <div className="space-y-2">
                  <Typography className="text-sm text-gray-700">
                    {completionPercentage}% complete • {completedTasks} of {totalTasks} items • Missing: Healthcare Directive, Executor Nomination
                  </Typography>
                </div>
              </div>

              <div className="health-divider"></div>

              {/* Health & risk */}
              <div className="health-section">
                <Typography className="text-base font-bold mb-8 text-gray-900">
                  Health & risk
                </Typography>
                <div className="space-y-2">
                  <Typography className="text-sm text-gray-700">
                    Health Score: <span className="font-bold text-green-600">{healthScore}</span> • Risk: <span className={`font-semibold ${
                      riskLevel === 'high' ? 'text-red-600' :
                      riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</span> • {criticalAlerts} critical, {warnings} warnings
                  </Typography>
                </div>
              </div>

              <div className="health-divider"></div>

              {/* Recommendations */}
              <div className="health-section">
                <Typography className="text-base font-bold mb-8 text-gray-900">
                  Recommendations
                </Typography>
                <div className="space-y-2">
                  {(estateStatus?.recommendations || [
                    'Update beneficiary contact information',
                    'Review document expiration dates',
                    'Complete healthcare directive',
                    'Schedule annual estate review'
                  ]).map((recommendation, index) => (
                    <Typography key={index} className="text-sm text-gray-700">
                      - {recommendation}
                    </Typography>
                  ))}
                </div>
              </div>
            </div>
          </Box>
        </Card>
      </motion.div>
        </section>

      {/* ROW 4: Quick Actions */}
      <section id="actionsSection" className="estate-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="quick-actions-card">
            <Box className="p-24">
              <Typography className="text-xl font-semibold mb-8">
                Quick Actions
              </Typography>
              <Typography className="text-sm text-gray-600 mb-16">
                Complete these to move your estate to 100%.
              </Typography>

              <div className="quick-actions-grid">
                <Button
                  variant="contained"
                  color="primary"
                  className="quick-action-button"
                  onClick={() => {
                    navigate('/people/beneficiaries');
                  }}
                >
                  Nominate executor now
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="quick-action-button"
                  onClick={() => {
                    navigate('/planning/directives');
                  }}
                >
                  Finish healthcare directive
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="quick-action-button"
                  onClick={() => {
                    navigate('/documents/vault');
                  }}
                >
                  Review key documents
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="quick-action-button"
                  onClick={() => {
                    // Could open a calendar or reminder dialog
                    alert('Annual review reminder set! We\'ll notify you when it\'s time.');
                  }}
                >
                  Schedule annual review
                </Button>
              </div>
            </Box>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}

export default OverviewTab;
