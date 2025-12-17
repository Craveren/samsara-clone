import { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import './AnalyticsTab.scss';

function AnalyticsTab() {
  const realEstateChartRef = useRef(null);
  const investmentsChartRef = useRef(null);
  const bankChartRef = useRef(null);
  const retirementChartRef = useRef(null);

  useEffect(() => {
    // Simple Google Charts loading
    let script = document.querySelector('script[src="https://www.gstatic.com/charts/loader.js"]');
    
    if (!script) {
      script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
        if (window.google) {
          window.google.charts.load('current', { packages: ['corechart'] });
          window.google.charts.setOnLoadCallback(drawAllAnalyticsCharts);
        }
      };
      script.onerror = () => {
        // Error will be handled by error boundary
        if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load Google Charts');
        }
      };
      document.head.appendChild(script);
    } else if (window.google && window.google.charts) {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawAllAnalyticsCharts);
    }

    // Handle window resize
    const handleResize = () => {
      if (window.google && window.google.visualization && window.google.visualization.ScatterChart) {
        setTimeout(drawAllAnalyticsCharts, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const drawAllAnalyticsCharts = () => {
    if (!window.google || !window.google.visualization) {
      if (process.env.NODE_ENV === 'development') {
      console.warn('Google Charts not loaded yet');
      }
      return;
    }
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
    drawRealEstateChart();
    drawInvestmentsChart();
    drawBankChart();
    drawRetirementChart();
    }, 100);
  };

  const drawRealEstateChart = () => {
    if (!realEstateChartRef.current || !window.google || !window.google.visualization) return;

    try {
    const data = new window.google.visualization.DataTable();
    data.addColumn('number', 'Annual property expenses (thousand)');
    data.addColumn('number', 'Estimated property value (thousand)');

    // Mock data: [expenses, value] pairs
    data.addRows([
      [8, 320], [12, 380], [15, 420], [18, 520], [22, 580], [25, 650],
      [10, 350], [14, 400], [16, 450], [20, 550], [24, 620], [28, 700]
    ]);

    const options = {
      title: '',
      hAxis: {
        title: 'Annual property expenses (thousand)',
        minValue: 0,
        maxValue: 35
      },
      vAxis: {
        title: 'Estimated property value (thousand)',
        minValue: 0,
        maxValue: 800
      },
      legend: 'none',
      trendlines: { 0: {} },
      pointSize: 6,
      colors: ['#7c3aed'],
      backgroundColor: 'transparent',
      chartArea: { width: '80%', height: '70%' }
    };

    const chart = new window.google.visualization.ScatterChart(realEstateChartRef.current);
    chart.draw(data, options);
    } catch (error) {
      // Error will be handled by error boundary
      if (process.env.NODE_ENV === 'development') {
      console.error('Error drawing real estate chart:', error);
      }
    }
  };

  const drawInvestmentsChart = () => {
    if (!investmentsChartRef.current || !window.google || !window.google.visualization) return;

    try {
    const data = new window.google.visualization.DataTable();
    data.addColumn('number', 'Monthly contribution (thousand)');
    data.addColumn('number', 'Portfolio value (thousand)');

    // Mock data: [contribution, portfolio] pairs
    data.addRows([
      [0.5, 40], [0.8, 65], [1.0, 85], [1.2, 110], [1.5, 140],
      [1.8, 170], [2.0, 200], [2.2, 240], [2.5, 280], [2.8, 320],
      [0.6, 50], [1.1, 95], [1.4, 125], [1.7, 155], [2.1, 220]
    ]);

    const options = {
      title: '',
      hAxis: {
        title: 'Monthly contribution (thousand)',
        minValue: 0,
        maxValue: 3.5
      },
      vAxis: {
        title: 'Portfolio value (thousand)',
        minValue: 0,
        maxValue: 400
      },
      legend: 'none',
      trendlines: { 0: {} },
      pointSize: 6,
      colors: ['#059669'],
      backgroundColor: 'transparent',
      chartArea: { width: '80%', height: '70%' }
    };

    const chart = new window.google.visualization.ScatterChart(investmentsChartRef.current);
    chart.draw(data, options);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
      console.error('Error drawing investments chart:', error);
      }
    }
  };

  const drawBankChart = () => {
    if (!bankChartRef.current || !window.google || !window.google.visualization) return;

    try {
    const data = new window.google.visualization.DataTable();
    data.addColumn('number', 'Monthly spending (thousand)');
    data.addColumn('number', 'Month-end balance (thousand)');

    // Mock data: [spending, balance] pairs (typically inverse relationship)
    data.addRows([
      [1.5, 25], [2.0, 18], [2.5, 12], [3.0, 8], [1.2, 28],
      [1.8, 22], [2.2, 16], [2.8, 10], [1.0, 32], [1.6, 24],
      [2.4, 14], [2.6, 11], [1.4, 26], [2.1, 19], [2.7, 9]
    ]);

    const options = {
      title: '',
      hAxis: {
        title: 'Monthly spending (thousand)',
        minValue: 0,
        maxValue: 4
      },
      vAxis: {
        title: 'Month-end balance (thousand)',
        minValue: 0,
        maxValue: 40
      },
      legend: 'none',
      trendlines: { 0: {} },
      pointSize: 6,
      colors: ['#dc2626'],
      backgroundColor: 'transparent',
      chartArea: { width: '80%', height: '70%' }
    };

    const chart = new window.google.visualization.ScatterChart(bankChartRef.current);
    chart.draw(data, options);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
      console.error('Error drawing bank chart:', error);
      }
    }
  };

  const drawRetirementChart = () => {
    if (!retirementChartRef.current || !window.google || !window.google.visualization) return;

    try {
    const data = new window.google.visualization.DataTable();
    data.addColumn('number', 'Yearly top-up (thousand)');
    data.addColumn('number', 'Projected value at 65 (thousand)');

    // Mock data: [yearly contribution, projected value] pairs
    data.addRows([
      [2, 220], [3, 280], [4, 340], [5, 400], [6, 460], [7, 520],
      [2.5, 250], [3.5, 310], [4.5, 370], [5.5, 430], [6.5, 490],
      [1.5, 190], [3.2, 295], [4.2, 355], [5.2, 415], [6.2, 475]
    ]);

    const options = {
      title: '',
      hAxis: {
        title: 'Yearly top-up (thousand)',
        minValue: 0,
        maxValue: 8
      },
      vAxis: {
        title: 'Projected value at 65 (thousand)',
        minValue: 0,
        maxValue: 600
      },
      legend: 'none',
      trendlines: { 0: {} },
      pointSize: 6,
      colors: ['#7c3aed'],
      backgroundColor: 'transparent',
      chartArea: { width: '80%', height: '70%' }
    };

    const chart = new window.google.visualization.ScatterChart(retirementChartRef.current);
    chart.draw(data, options);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
      console.error('Error drawing retirement chart:', error);
      }
    }
  };

  return (
    <div className="analytics-page">
      {/* Section Header */}
      <div className="analytics-header">
        <Typography className="analytics-title">
          Estate Value Breakdown & Trends
        </Typography>
      </div>

      {/* Analytics Cards Grid */}
      <div className="analytics-grid">
        {/* Real Estate Card */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-left">
              <Typography className="analytics-card-title">Real Estate</Typography>
              <Typography className="analytics-card-amount">$450,000 - 38% of estate</Typography>
            </div>
            <div className="analytics-card-pill">Homes & properties</div>
          </div>
          <Typography className="analytics-card-description">
            Estimated property value vs annual expenses with a trendline.
          </Typography>
          <div className="analytics-chart-container">
            <div ref={realEstateChartRef} className="analytics-chart" />
          </div>
        </div>

        {/* Investments Card */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-left">
              <Typography className="analytics-card-title">Investments</Typography>
              <Typography className="analytics-card-amount">$280,000 - 24% of estate</Typography>
            </div>
            <div className="analytics-card-pill">Portfolio</div>
          </div>
          <Typography className="analytics-card-description">
            Portfolio value relative to monthly contributions.
          </Typography>
          <div className="analytics-chart-container">
            <div ref={investmentsChartRef} className="analytics-chart" />
          </div>
        </div>

        {/* Bank Accounts Card */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-left">
              <Typography className="analytics-card-title">Bank Accounts</Typography>
              <Typography className="analytics-card-amount">$95,000 - 8% of estate</Typography>
            </div>
            <div className="analytics-card-pill">Liquidity</div>
          </div>
          <Typography className="analytics-card-description">
            Month-end balance compared with monthly spending.
          </Typography>
          <div className="analytics-chart-container">
            <div ref={bankChartRef} className="analytics-chart" />
          </div>
        </div>

        {/* Retirement Accounts Card */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-left">
              <Typography className="analytics-card-title">Retirement Accounts</Typography>
              <Typography className="analytics-card-amount">$350,000 - 30% of estate</Typography>
            </div>
            <div className="analytics-card-pill">Long-term</div>
          </div>
          <Typography className="analytics-card-description">
            Projected value at 65 based on yearly top-ups.
          </Typography>
          <div className="analytics-chart-container">
            <div ref={retirementChartRef} className="analytics-chart" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsTab;
