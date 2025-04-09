// DOM Elements
const elements = {
  vgsSlider: document.getElementById('vgs'),
  vdsSlider: document.getElementById('vds'),
  vgsVal: document.getElementById('vgsVal'),
  vdsVal: document.getElementById('vdsVal'),
  idDisplay: document.getElementById('id'),
  operationMode: document.getElementById('operationMode'),
  tableBody: document.getElementById('tableBody'),
  simulateBtn: document.getElementById('simulateBtn'),
  resetBtn: document.getElementById('resetBtn'),
  clearTableBtn: document.getElementById('clearTableBtn'),
  exportDataBtn: document.getElementById('exportDataBtn'),
  currentYear: document.getElementById('currentYear')
};

// Constants for MOSFET simulation
const MOSFET_PARAMS = {
  Vth: 2.0,              // Threshold voltage (V)
  k: 0.5,                // Transconductance parameter (mA/V²)
  lambda: 0.02,          // Channel length modulation parameter (1/V)
  earlyVoltage: 50,      // Early voltage for improved saturation model (V)
  minVgs: 0,             // Minimum gate-source voltage (V)
  maxVgs: 10,            // Maximum gate-source voltage (V)
  minVds: 0,             // Minimum drain-source voltage (V)
  maxVds: 10             // Maximum drain-source voltage (V)
};

// Chart configuration
let viChart = null;
const chartColors = [
  '#2563eb', '#9333ea', '#ec4899', '#ef4444', 
  '#f97316', '#eab308', '#14b8a6', '#3b82f6'
];

// Data store
const measurementSeries = [];
let currentSeries = [];

// Initialize
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  // Set current year in footer
  elements.currentYear.textContent = new Date().getFullYear();
  
  // Set up event listeners
  elements.vgsSlider.addEventListener('input', () => updateSliderDisplay(elements.vgsSlider, elements.vgsVal));
  elements.vdsSlider.addEventListener('input', () => updateSliderDisplay(elements.vdsSlider, elements.vdsVal));
  elements.simulateBtn.addEventListener('click', runSimulation);
  elements.resetBtn.addEventListener('click', resetSimulation);
  elements.clearTableBtn.addEventListener('click', clearTable);
  elements.exportDataBtn.addEventListener('click', exportMeasurements);
  
  // Initialize chart
  initializeChart();
  
  // Initial UI update
  updateSliderDisplay(elements.vgsSlider, elements.vgsVal);
  updateSliderDisplay(elements.vdsSlider, elements.vdsVal);
}

function updateSliderDisplay(slider, display) {
  display.textContent = parseFloat(slider.value).toFixed(1);
}

function calculateID(vgs, vds) {
  // If VGS is below threshold, the transistor is OFF (cut-off region)
  if (vgs < MOSFET_PARAMS.Vth) {
    return {
      current: 0,
      region: 'Cut-off'
    };
  }
  
  // Determine operation region and calculate current
  if (vds < (vgs - MOSFET_PARAMS.Vth)) {
    // Triode (linear) region
    const id = MOSFET_PARAMS.k * (
      (vgs - MOSFET_PARAMS.Vth) * vds - 
      (vds ** 2) / 2
    ) * (1 + MOSFET_PARAMS.lambda * vds);
    
    return {
      current: id,
      region: 'Triode'
    };
  } else {
    // Saturation region with channel length modulation
    const id = 0.5 * MOSFET_PARAMS.k * 
      (vgs - MOSFET_PARAMS.Vth) ** 2 * 
      (1 + MOSFET_PARAMS.lambda * vds);
    
    return {
      current: id,
      region: 'Saturation'
    };
  }
}

function runSimulation() {
  const vgs = parseFloat(elements.vgsSlider.value);
  const vds = parseFloat(elements.vdsSlider.value);
  
  // Calculate drain current and operation region
  const result = calculateID(vgs, vds);
  const id = result.current;
  
  // Update UI
  elements.idDisplay.textContent = id.toFixed(2);
  elements.operationMode.textContent = result.region;
  elements.idDisplay.parentElement.classList.add('highlight');
  elements.operationMode.parentElement.classList.add('highlight');
  
  // Remove highlight after animation
  setTimeout(() => {
    elements.idDisplay.parentElement.classList.remove('highlight');
    elements.operationMode.parentElement.classList.remove('highlight');
  }, 1000);
  
  // Store measurement
  const measurement = { 
    vgs, 
    vds, 
    id: id.toFixed(2), 
    region: result.region,
    timestamp: new Date().toISOString()
  };
  
  currentSeries.push(measurement);
  
  // Add to table
  addToTable(measurement);
  
  // Update chart
  updateChart(measurement);
  
  // Update interactive circuit diagram
  updateCircuitDiagram(vgs, vds, id, result.region);
}

function addToTable(measurement) {
  const row = elements.tableBody.insertRow();
  row.classList.add('highlight');
  
  const vgsCell = row.insertCell(0);
  const vdsCell = row.insertCell(1);
  const idCell = row.insertCell(2);
  const regionCell = row.insertCell(3);
  
  vgsCell.textContent = measurement.vgs.toFixed(1);
  vdsCell.textContent = measurement.vds.toFixed(1);
  idCell.textContent = measurement.id;
  regionCell.textContent = measurement.region;
  
  // Scroll to bottom of table
  setTimeout(() => {
    row.scrollIntoView({ behavior: 'smooth', block: 'end' });
    row.classList.remove('highlight');
  }, 100);
}

function initializeChart() {
  const ctx = document.getElementById('viChart').getContext('2d');
  
  Chart.defaults.font.family = getComputedStyle(document.body).getPropertyValue('--font-family') || "'Segoe UI', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#475569';
  
  viChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: `VGS = ${elements.vgsSlider.value}V`,
        data: [],
        borderColor: chartColors[0],
        backgroundColor: chartColors[0],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 15,
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1e293b',
          bodyColor: '#475569',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return [
                `VGS: ${context.raw?.vgs || context.dataset.label.split('=')[1].replace('V', '')}V`,
                `VDS: ${context.parsed?.x || context.parsed.x}V`,
                `ID: ${context.parsed?.y || context.parsed.y}mA`,
                `Region: ${context.raw?.region || 'Unknown'}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Drain-Source Voltage (VDS) [V]',
            padding: {
              top: 10,
              bottom: 0
            }
          },
          min: 0,
          max: MOSFET_PARAMS.maxVds,
          grid: {
            color: '#e2e8f0',
            borderColor: '#cbd5e1',
            tickColor: '#cbd5e1'
          }
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: 'Drain Current (ID) [mA]',
            padding: {
              top: 0,
              bottom: 10
            }
          },
          min: 0,
          grid: {
            color: '#e2e8f0',
            borderColor: '#cbd5e1',
            tickColor: '#cbd5e1'
          }
        }
      }
    }
  });
}

function updateChart(measurement) {
  // Check if we have a new VGS value and need to start a new series
  const currentVgs = parseFloat(elements.vgsSlider.value);
  let lastDatasetVgs = 0;
  
  if (viChart.data.datasets.length > 0 && viChart.data.datasets[0].label) {
    const vgsMatch = viChart.data.datasets[0].label.match(/VGS = (\d+\.?\d*)V/);
    if (vgsMatch && vgsMatch[1]) {
      lastDatasetVgs = parseFloat(vgsMatch[1]);
    }
  }
  
  if (currentVgs !== lastDatasetVgs && viChart.data.datasets[0].data.length > 0) {
    // Start a new dataset for this VGS value
    const colorIndex = viChart.data.datasets.length % chartColors.length;
    
    viChart.data.datasets.push({
      label: `VGS = ${currentVgs.toFixed(1)}V`,
      data: [],
      borderColor: chartColors[colorIndex],
      backgroundColor: chartColors[colorIndex],
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: false
    });
    
    // Store the previous series
    if (currentSeries.length > 0) {
      measurementSeries.push([...currentSeries]);
      currentSeries = [];
    }
  }
  
  // Add point to the current dataset
  const datasetIndex = viChart.data.datasets.length - 1;
  
  viChart.data.datasets[datasetIndex].data.push({
    x: measurement.vds,
    y: parseFloat(measurement.id),
    vgs: measurement.vgs,
    region: measurement.region
  });
  
  // Sort points by x value to ensure proper line drawing
  viChart.data.datasets[datasetIndex].data.sort((a, b) => a.x - b.x);
  
  // Update chart
  viChart.update();
}

function resetSimulation() {
  // Store current series if not empty
  if (currentSeries.length > 0) {
    measurementSeries.push([...currentSeries]);
    currentSeries = [];
  }
  
  // Reset chart
  viChart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });
  
  // Keep only the first dataset
  viChart.data.datasets = [viChart.data.datasets[0]];
  viChart.data.datasets[0].label = `VGS = ${elements.vgsSlider.value}V`;
  
  viChart.update();
}

function clearTable() {
  if (confirm('Are you sure you want to clear the measurement table?')) {
    elements.tableBody.innerHTML = '';
  }
}

function exportMeasurements() {
  // Prepare data
  const allSeries = [...measurementSeries, currentSeries].filter(series => series.length > 0);
  
  if (allSeries.length === 0) {
    alert('No measurements to export.');
    return;
  }
  
  // Create CSV content
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Series,VGS (V),VDS (V),ID (mA),Region,Timestamp\n';
  
  allSeries.forEach((series, seriesIndex) => {
    series.forEach(measurement => {
      csvContent += `${seriesIndex + 1},${measurement.vgs},${measurement.vds},${measurement.id},${measurement.region},${measurement.timestamp}\n`;
    });
  });
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `mosfet_measurements_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
}

function updateCircuitDiagram(vgs, vds, id, region) {
  // Get the SVG object element
  const circuitSvg = document.querySelector('.interactive-circuit');
  
  // Make sure the SVG is loaded and accessible
  if (circuitSvg && circuitSvg.contentDocument) {
    try {
      // Access the SVG document
      const svgDoc = circuitSvg.contentDocument;
      
      // Try to call the updateCircuitValues function defined in the SVG
      if (svgDoc.defaultView && typeof svgDoc.defaultView.updateCircuitValues === 'function') {
        svgDoc.defaultView.updateCircuitValues(vgs, vds, id, region);
      }
    } catch (error) {
      console.warn('Could not update interactive circuit diagram:', error);
    }
  }
}

// Add an event listener for when the SVG is loaded
document.addEventListener('DOMContentLoaded', () => {
  const circuitSvg = document.querySelector('.interactive-circuit');
  if (circuitSvg) {
    circuitSvg.addEventListener('load', () => {
      // Initialize the circuit diagram with current values
      const vgs = parseFloat(elements.vgsSlider.value);
      const vds = parseFloat(elements.vdsSlider.value);
      const result = calculateID(vgs, vds);
      updateCircuitDiagram(vgs, vds, result.current, result.region);
    });
  }
});
