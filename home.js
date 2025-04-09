// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
  // Set copyright year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Handle tab switching in experiments section
  setupTabSwitching();
  
  // Add hover effects and animations
  addCardInteractions();
  
  // Initialize any buttons or interactive elements
  initButtons();
  
  // Setup navigation functionality
  setupNavigation();
  
  // Setup profile toggle functionality
  setupProfileToggle();
  
  // Setup circuit card click handlers
  setupCircuitCards();
  
  // Contact Form Functionality
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic form validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const consent = document.getElementById('consent').checked;
      
      let isValid = true;
      let errorMessage = '';
      
      // Simple validation
      if (name === '') {
        isValid = false;
        errorMessage += 'Name is required.\n';
      }
      
      if (email === '') {
        isValid = false;
        errorMessage += 'Email is required.\n';
      } else if (!isValidEmail(email)) {
        isValid = false;
        errorMessage += 'Please enter a valid email address.\n';
      }
      
      if (subject === '') {
        isValid = false;
        errorMessage += 'Subject is required.\n';
      }
      
      if (message === '') {
        isValid = false;
        errorMessage += 'Message is required.\n';
      }
      
      if (!consent) {
        isValid = false;
        errorMessage += 'You must consent to our privacy policy.\n';
      }
      
      if (isValid) {
        // In a real application, this would submit the form data to a server
        // For now, we'll just show a success message
        const formContainer = contactForm.parentElement;
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
          <h3>Thank you for your message!</h3>
          <p>We have received your inquiry and will get back to you as soon as possible.</p>
          <button class="primary-btn" id="resetForm">Send Another Message</button>
        `;
        
        // Hide the form and show success message
        contactForm.style.display = 'none';
        formContainer.appendChild(successMessage);
        
        // Add listener to the reset button
        document.getElementById('resetForm').addEventListener('click', function() {
          contactForm.reset();
          contactForm.style.display = 'block';
          formContainer.removeChild(successMessage);
        });
      } else {
        // Display error message
        alert('Please correct the following errors:\n' + errorMessage);
      }
    });
  }
});

/**
 * Sets up tab switching functionality for the experiments section
 */
function setupTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the tab name from data attribute
      const tabName = button.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to current tab and content
      button.classList.add('active');
      document.getElementById(tabName).classList.add('active');
      
      // Add a subtle animation to the newly displayed content
      document.getElementById(tabName).classList.add('highlight');
      setTimeout(() => {
        document.getElementById(tabName).classList.remove('highlight');
      }, 1000);
    });
  });
}

/**
 * Adds hover effects and interactions to cards and buttons
 */
function addCardInteractions() {
  // Add subtle hover effect to experiment cards
  const experimentCards = document.querySelectorAll('.experiment-card');
  experimentCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = 'var(--shadow-md)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
  
  // Add hover effect to activity items
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = '#f8fafc';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = '';
    });
  });
}

/**
 * Sets up navigation between different experiment pages
 */
function setupNavigation() {
  // Map experiment names to their corresponding URLs
  const experimentURLs = {
    'MOSFET V-I Characteristics': 'mosfet_simulator.html',
    'BJT Amplifier': 'bjt_simulator.html',
    'Inverting Amplifier': 'opamp_simulator.html',
    'Common Source Amplifier': 'common_source.html',
    'CMOS Inverter': 'cmos_inverter.html',
    'Active Filter Design': 'active_filter.html',
    'Current Mirror Circuit': 'current_mirror.html',
    'Differential Amplifier': 'diff_amplifier.html',
    'Sequential Logic Circuits': 'sequential_logic.html',
    'Phase-Locked Loop': 'pll_circuit.html',
    'JFET Characteristics': 'jfet_simulator.html',
    'Schmitt Trigger Design': 'schmitt_trigger.html',
    'MOSFET Amplifier Simulation': 'mosfet_simulator.html'
  };
  
  // Add click event to all experiment links
  document.querySelectorAll('.experiment-link, .action-btn').forEach(element => {
    element.addEventListener('click', function(e) {
      // Check if this is an experiment navigation button
      if (this.textContent.trim() === 'Review' || 
          this.textContent.trim() === 'Continue' || 
          this.textContent.trim() === 'Start' ||
          this.textContent.trim() === 'View Results') {
        
        e.preventDefault();
        
        // Find the parent experiment card or activity item
        const parent = this.closest('.experiment-card') || this.closest('.activity-item');
        if (parent) {
          const title = parent.querySelector('h3').textContent;
          
          // If we have a URL for this experiment, navigate to it
          if (experimentURLs[title]) {
            // For non-existing pages, create a temporary page and redirect
            if (title !== 'MOSFET V-I Characteristics' && title !== 'MOSFET Amplifier Simulation') {
              createTemporaryPage(title);
              return;
            }
            
            // Otherwise go to the real page
            window.location.href = experimentURLs[title];
          } else {
            // If no URL is found, create a temporary page
            createTemporaryPage(title);
          }
        }
      }
    });
  });
  
  // Handle main navigation links
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip handling for real pages
      if (href === 'index.html' || href === 'mosfet_simulator.html') {
        return;
      }
      
      // For non-existing simulators, create a temporary page
      if (href === '#') {
        e.preventDefault();
        const simulatorName = this.textContent.trim();
        createTemporaryPage(simulatorName);
      }
    });
  });
}

/**
 * Creates a temporary page for experiments that don't have full implementations yet
 * @param {string} experimentName - The name of the experiment
 */
function createTemporaryPage(experimentName) {
  // Create a temporary HTML document
  const tempHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${experimentName} - Electronic Circuit Simulation Lab</title>
    <link rel="stylesheet" href="style.css">
    <style>
      .placeholder-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 3rem;
      }
      .coming-soon {
        font-size: 1.5rem;
        margin-top: 1rem;
        color: var(--primary-color);
      }
      .blueprint {
        max-width: 80%;
        height: auto;
        margin: 2rem 0;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
      }
    </style>
  </head>
  <body>
    <header class="main-header">
      <div class="header-content">
        <h1 class="site-title">Electronic Circuit Simulation Lab</h1>
        <nav class="main-nav">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="mosfet_simulator.html">MOSFET Simulator</a></li>
            <li><a href="#" class="${experimentName.includes('BJT') ? 'active' : ''}">BJT Simulator</a></li>
            <li><a href="#" class="${experimentName.includes('Op-Amp') || experimentName.includes('Inverting') ? 'active' : ''}">Op-Amp Circuits</a></li>
            <li><a href="#" class="${experimentName.includes('Logic') ? 'active' : ''}">Logic Gates</a></li>
          </ul>
        </nav>
      </div>
    </header>
    
    <main class="container">
      <div class="placeholder-content">
        <h1>${experimentName}</h1>
        <p class="coming-soon">Coming Soon</p>
        <p>This experiment is currently under development and will be available soon.</p>
        
        <img class="blueprint" src="https://via.placeholder.com/800x500?text=${experimentName.replace(/ /g, '+')}+Circuit+Diagram" alt="${experimentName} Blueprint">
        
        <div class="features-list">
          <h2>Planned Features</h2>
          <ul>
            <li>Interactive circuit diagram with adjustable components</li>
            <li>Real-time simulation and waveform visualization</li>
            <li>Comprehensive data collection and analysis tools</li>
            <li>Performance optimization and efficiency calculation</li>
            <li>Exportable results and reports</li>
          </ul>
        </div>
        
        <button class="primary-btn" onclick="window.location.href='index.html'">Return to Dashboard</button>
      </div>
    </main>
    
    <footer class="page-footer">
      <div class="footer-content">
        <div class="footer-nav">
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        <p>&copy; <span id="currentYear">${new Date().getFullYear()}</span> Electronic Circuit Simulation Lab</p>
      </div>
    </footer>
  </body>
  </html>
  `;
  
  // Create a blob from the HTML content
  const blob = new Blob([tempHTML], { type: 'text/html' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Open the URL in a new tab
  window.open(url, '_blank');
}

/**
 * Initializes button functionality
 */
function initButtons() {
  // Handle action buttons (View Results, Continue, Start)
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const actionType = this.textContent.trim();
      
      // Find the parent experiment or activity item
      const parent = this.closest('.activity-item') || this.closest('.experiment-card') || this.closest('.recommended-item');
      
      if (parent) {
        const title = parent.querySelector('h3').textContent;
        
        // Handle "Add to List" button specifically
        if (actionType === 'Add to List') {
          // Prevent default navigation
          e.preventDefault();
          
          // Change button text temporarily to provide feedback
          this.textContent = 'Added!';
          this.style.backgroundColor = '#16a34a';
          
          // Add to stats - increase pending count
          updateExperimentStats('pending', 1);
          
          // Reset button after a delay
          setTimeout(() => {
            this.textContent = 'Add to List';
            this.style.backgroundColor = '';
          }, 2000);
          
          // Add to pending tab
          addToPendingExperiments(title);
        }
        
        // Handle View Results, Continue, and Start buttons through setupNavigation
        // No additional code needed here as setupNavigation handles these
      }
    });
  });
  
  // Handle "View All Completed" button
  const viewMoreBtn = document.querySelector('.view-more .secondary-btn');
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', function() {
      // Switch to the completed tab if not already active
      const completedTab = document.querySelector('[data-tab="completed"]');
      if (!completedTab.classList.contains('active')) {
        completedTab.click();
      }
      
      // Show loading animation
      this.textContent = 'Loading...';
      
      // Simulate loading more items
      setTimeout(() => {
        // Add more completed experiments
        const completedGrid = document.querySelector('#completed .experiment-grid');
        
        const newExperiments = [
          {
            title: 'RC Circuit Analysis',
            date: 'Completed on Mar 10, 2023',
            image: 'images/rc_circuit.svg',
            grade: 'B',
            score: '85%'
          },
          {
            title: 'Voltage Regulator',
            date: 'Completed on Mar 5, 2023',
            image: 'images/voltage_regulator.svg',
            grade: 'A',
            score: '92%'
          },
          {
            title: 'Oscillator Design',
            date: 'Completed on Feb 28, 2023',
            image: 'images/oscillator.svg',
            grade: 'A-',
            score: '90%'
          }
        ];
        
        newExperiments.forEach(exp => {
          const card = document.createElement('div');
          card.className = 'experiment-card';
          card.innerHTML = `
            <div class="experiment-img">
              <img src="${exp.image}" alt="${exp.title}">
            </div>
            <div class="experiment-details">
              <h3>${exp.title}</h3>
              <p class="experiment-date">${exp.date}</p>
              <div class="experiment-stats">
                <span class="stat">Grade: ${exp.grade}</span>
                <span class="stat">Score: ${exp.score}</span>
              </div>
              <a href="#" class="experiment-link">Review</a>
            </div>
          `;
          completedGrid.appendChild(card);
          
          // Add the hover effects to the new card
          card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-md)';
          });
          
          card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
          });
        });
        
        // Update stats card
        updateExperimentStats('completed', 3);
        
        // Update button text to reflect new total
        this.textContent = 'View All Completed (15)';
        
        // Add click event to new experiment links
        setupNavigation();
      }, 1000);
    });
  }
}

/**
 * Updates the experiment count stats in the profile section
 * @param {string} type - The type of experiment (completed, in-progress, pending)
 * @param {number} change - The amount to change (positive or negative)
 */
function updateExperimentStats(type, change) {
  const statElements = {
    completed: document.querySelector('.stat-card:nth-child(1) .stat-value'),
    'in-progress': document.querySelector('.stat-card:nth-child(2) .stat-value'),
    pending: document.querySelector('.stat-card:nth-child(3) .stat-value')
  };
  
  if (statElements[type]) {
    const currentValue = parseInt(statElements[type].textContent, 10);
    statElements[type].textContent = currentValue + change;
    
    // Animate the change
    statElements[type].classList.add('highlight-value');
    setTimeout(() => {
      statElements[type].classList.remove('highlight-value');
    }, 1500);
  }
}

/**
 * Adds a new experiment to the pending experiments tab
 * @param {string} title - The title of the experiment to add
 */
function addToPendingExperiments(title) {
  // Determine image path - use SVG if possible or create placeholder
  let imageUrl = `images/${title.toLowerCase().replace(/ /g, '_')}.svg`;
  
  // Create a new experiment card
  const card = document.createElement('div');
  card.className = 'experiment-card';
  card.innerHTML = `
    <div class="experiment-img pending-img">
      <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="experiment-details">
      <h3>${title}</h3>
      <p class="experiment-date">Due by ${formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))}</p>
      <p class="experiment-difficulty">Difficulty: Intermediate</p>
      <a href="#" class="experiment-link">Start</a>
    </div>
  `;
  
  // Find the pending tab's experiment grid and add the card
  const pendingGrid = document.querySelector('#pending .experiment-grid');
  pendingGrid.appendChild(card);
  
  // Add hover effects to the new card
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = 'var(--shadow-md)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
  
  // Add navigation event to the new link
  card.querySelector('.experiment-link').addEventListener('click', function(e) {
    e.preventDefault();
    createTemporaryPage(title);
  });
  
  // Switch to the pending tab to show the new item
  document.querySelector('[data-tab="pending"]').click();
}

// Profile toggle functionality
function setupProfileToggle() {
  const profileAvatar = document.getElementById('profileAvatar');
  const profileSidebar = document.getElementById('profileSidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const pageOverlay = document.getElementById('pageOverlay');
  
  if (profileAvatar && profileSidebar) {
    // Open sidebar when avatar is clicked
    profileAvatar.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      profileSidebar.classList.add('active');
      pageOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close sidebar when close button is clicked
    if (closeSidebar) {
      closeSidebar.addEventListener('click', function() {
        profileSidebar.classList.remove('active');
        pageOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      });
    }
    
    // Close sidebar when overlay is clicked
    if (pageOverlay) {
      pageOverlay.addEventListener('click', function() {
        profileSidebar.classList.remove('active');
        pageOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      });
    }
    
    // Close sidebar when ESC key is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && profileSidebar.classList.contains('active')) {
        profileSidebar.classList.remove('active');
        pageOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      }
    });
  }
}

/**
 * Utility function to format dates
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Setup circuit card functionality
function setupCircuitCards() {
  const circuitCards = document.querySelectorAll('.circuit-card');
  const circuitModal = document.getElementById('circuitModal');
  const modalContent = circuitModal.querySelector('.modal-content');
  const closeModal = circuitModal.querySelector('.close-modal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalFormulas = document.getElementById('modalFormulas');
  const modalInstructions = document.getElementById('modalInstructions');
  
  // Circuit data
  const circuitData = {
    'mosfet-amplifier': {
      title: 'MOSFET Common Source Amplifier',
      image: 'images/mosfet_circuit.svg',
      description: 'The common source amplifier is one of the most commonly used single-stage MOSFET amplifiers. It provides voltage gain with 180° phase shift. The source is connected to ground (or a bypass capacitor), the input signal is applied to the gate, and the output is taken from the drain.',
      formulas: [
        {
          name: 'Voltage Gain',
          formula: 'A<sub>v</sub> = -g<sub>m</sub> × (r<sub>o</sub> ∥ R<sub>D</sub>)',
          description: 'Where g<sub>m</sub> is the transconductance, r<sub>o</sub> is the output resistance of the MOSFET, and R<sub>D</sub> is the drain resistor.'
        },
        {
          name: 'Transconductance',
          formula: 'g<sub>m</sub> = 2 × I<sub>D</sub> / V<sub>GST</sub>',
          description: 'Where I<sub>D</sub> is the drain current and V<sub>GST</sub> is the gate-to-source threshold voltage.'
        },
        {
          name: 'Input Impedance',
          formula: 'Z<sub>in</sub> ≈ ∞ (very high)',
          description: 'The input impedance of a MOSFET is extremely high, typically in the MΩ to GΩ range.'
        }
      ],
      instructions: [
        'Set the DC bias point by selecting appropriate R<sub>D</sub> and R<sub>S</sub> values to ensure the MOSFET operates in saturation region.',
        'Monitor V<sub>GS</sub> to ensure it exceeds V<sub>th</sub> (threshold voltage) for proper operation.',
        'Use coupling capacitors at input and output to block DC components.',
        'For improved stability, add a bypass capacitor across R<sub>S</sub> to prevent negative feedback at the signal frequency.',
        'Measure the voltage gain by applying a small AC signal (typically 50-100mV) at the input.'
      ]
    },
    'current-mirror': {
      title: 'MOSFET Current Mirror',
      image: 'images/current_mirror.svg',
      description: 'A current mirror is a circuit designed to copy a current through one active device by controlling the current in another active device, keeping the output current constant regardless of loading. It is widely used in analog integrated circuits as a biasing element.',
      formulas: [
        {
          name: 'Mirror Equation (Ideal)',
          formula: 'I<sub>out</sub> = I<sub>ref</sub> × (W<sub>2</sub>/L<sub>2</sub>) / (W<sub>1</sub>/L<sub>1</sub>)',
          description: 'Where W and L are the width and length of the transistors respectively.'
        },
        {
          name: 'Output Resistance',
          formula: 'r<sub>out</sub> = r<sub>o2</sub> = VA / I<sub>out</sub>',
          description: 'Where VA is the Early voltage and r<sub>o2</sub> is the output resistance of M2.'
        },
        {
          name: 'Minimum Voltage for Operation',
          formula: 'V<sub>out,min</sub> = V<sub>GS</sub> - V<sub>th</sub>',
          description: 'The minimum output voltage required for the mirror to operate correctly.'
        }
      ],
      instructions: [
        'Connect the reference current source to the input of the mirror.',
        'Ensure both transistors have the same dimensions for a 1:1 current ratio.',
        'To increase or decrease the output current ratio, adjust the W/L ratio of the output transistor.',
        'Maintain V<sub>DS</sub> > V<sub>GS</sub> - V<sub>th</sub> to ensure saturation region operation.',
        'For improved accuracy, use cascode structures or longer channel lengths to minimize channel length modulation effects.'
      ]
    },
    'cmos-inverter': {
      title: 'CMOS Inverter',
      image: 'images/cmos_inverter.svg', 
      description: 'The CMOS inverter is the basic building block of digital logic circuits. It consists of complementary PMOS and NMOS transistors that provide low static power consumption and high noise immunity. The output voltage is the inverse of the input voltage.',
      formulas: [
        {
          name: 'Switching Threshold',
          formula: 'V<sub>M</sub> = (V<sub>DD</sub> × √(K<sub>n</sub>/K<sub>p</sub>) + V<sub>th,n</sub> + |V<sub>th,p</sub>|) / (1 + √(K<sub>n</sub>/K<sub>p</sub>))',
          description: 'Where K<sub>n</sub> and K<sub>p</sub> are the transconductance parameters, and V<sub>th,n</sub> and V<sub>th,p</sub> are the threshold voltages.'
        },
        {
          name: 'Propagation Delay',
          formula: 't<sub>p</sub> = (t<sub>pHL</sub> + t<sub>pLH</sub>)/2',
          description: 'The average of high-to-low and low-to-high propagation delays.'
        },
        {
          name: 'Static Power Consumption',
          formula: 'P<sub>static</sub> = I<sub>leakage</sub> × V<sub>DD</sub>',
          description: 'Power consumed when the circuit is not switching.'
        }
      ],
      instructions: [
        'Design the PMOS and NMOS transistors with appropriate W/L ratios to achieve the desired switching threshold.',
        'For balanced rise and fall times, compensate for mobility differences by making the PMOS wider than the NMOS (typically 2-3 times).',
        'Verify the noise margins (NMH and NML) to ensure robust operation.',
        'Test the inverter with different load capacitances to measure propagation delays.',
        'For minimum power consumption, minimize the overlap time during transitions.'
      ]
    },
    'differential-amplifier': {
      title: 'Differential Amplifier',
      image: 'images/differential_amplifier.svg',
      description: 'A differential amplifier amplifies the difference between two input voltages while rejecting common-mode signals. It is the basic building block of operational amplifiers and many analog circuits. The circuit typically uses a current mirror as an active load to maximize gain.',
      formulas: [
        {
          name: 'Differential Gain',
          formula: 'A<sub>d</sub> = g<sub>m</sub> × R<sub>out</sub>',
          description: 'Where g<sub>m</sub> is the transconductance of the input transistors and R<sub>out</sub> is the output resistance.'
        },
        {
          name: 'Common-Mode Rejection Ratio',
          formula: 'CMRR = A<sub>d</sub> / A<sub>cm</sub>',
          description: 'The ratio of differential gain to common-mode gain, usually expressed in dB.'
        },
        {
          name: 'Input Common-Mode Range',
          formula: 'ICMR: V<sub>SS</sub> + V<sub>GS1</sub> + V<sub>DSsat3</sub> ≤ V<sub>in,cm</sub> ≤ V<sub>DD</sub> - |V<sub>GS4</sub>| - V<sub>DSsat1</sub>',
          description: 'The range of common-mode input voltages for which all transistors remain in saturation.'
        }
      ],
      instructions: [
        'Ensure the tail current source provides sufficient current for the desired transconductance.',
        'Match the input transistors (M1 and M2) closely to minimize offset voltages.',
        'Design the current mirror load (M3 and M4) for high output impedance to maximize gain.',
        'Keep the differential inputs within the ICMR to avoid distortion.',
        'For testing, apply common-mode and differential signals separately to characterize CMRR.'
      ]
    },
    'common-source': {
      title: 'Common Source Amplifier',
      image: 'images/common_source.svg',
      description: 'The common source amplifier is a versatile single-stage MOSFET amplifier with the source grounded or at AC ground. It provides moderate to high voltage gain, high input impedance, and moderate output impedance. The common source configuration is analogous to the common emitter BJT amplifier.',
      formulas: [
        {
          name: 'Voltage Gain',
          formula: 'A<sub>v</sub> = -g<sub>m</sub> × (r<sub>o</sub> ∥ R<sub>D</sub>)',
          description: 'Where g<sub>m</sub> is the transconductance, r<sub>o</sub> is the output resistance of the MOSFET, and R<sub>D</sub> is the drain resistor.'
        },
        {
          name: 'Upper Cutoff Frequency',
          formula: 'f<sub>H</sub> = 1 / (2π × R<sub>out</sub> × C<sub>L</sub>)',
          description: 'Where R<sub>out</sub> is the output resistance and C<sub>L</sub> is the load capacitance.'
        },
        {
          name: 'Lower Cutoff Frequency',
          formula: 'f<sub>L</sub> = 1 / (2π × R<sub>in</sub> × C<sub>in</sub>)',
          description: 'Where R<sub>in</sub> is the input resistance and C<sub>in</sub> is the input coupling capacitor.'
        }
      ],
      instructions: [
        'Select R<sub>D</sub> to establish the desired quiescent point and gain.',
        'Choose the gate bias resistors (voltage divider) to set the correct V<sub>GS</sub>.',
        'Include a source resistor R<sub>S</sub> for stability and add a bypass capacitor for increased gain.',
        'Size the coupling capacitors to achieve the desired low-frequency response.',
        'Measure the frequency response to verify bandwidth and gain.'
      ]
    },
    'jfet-amplifier': {
      title: 'JFET Amplifier Circuit',
      image: 'images/jfet.svg',
      description: 'The Junction Field-Effect Transistor (JFET) amplifier operates based on controlling current flow through a channel of semiconductor material. Unlike MOSFETs, JFETs have a junction between the gate and channel, and are typically operated in depletion mode. They offer low noise, high input impedance, and good high-frequency performance.',
      formulas: [
        {
          name: 'Drain Current',
          formula: 'I<sub>D</sub> = I<sub>DSS</sub> × (1 - V<sub>GS</sub>/V<sub>P</sub>)<sup>2</sup>',
          description: 'Where I<sub>DSS</sub> is the saturation drain current and V<sub>P</sub> is the pinch-off voltage.'
        },
        {
          name: 'Transconductance',
          formula: 'g<sub>m</sub> = g<sub>m0</sub> × (1 - V<sub>GS</sub>/V<sub>P</sub>)',
          description: 'Where g<sub>m0</sub> = 2 × I<sub>DSS</sub> / |V<sub>P</sub>| is the maximum transconductance.'
        },
        {
          name: 'Voltage Gain',
          formula: 'A<sub>v</sub> = -g<sub>m</sub> × R<sub>D</sub>',
          description: 'For a common-source configuration with drain resistor R<sub>D</sub>.'
        }
      ],
      instructions: [
        'Start by selecting the bias point based on I<sub>DSS</sub> and V<sub>P</sub> parameters of the JFET.',
        'Design the gate-source self-bias with R<sub>G</sub> and R<sub>S</sub> to achieve the desired V<sub>GS</sub>.',
        'Size R<sub>D</sub> for the required voltage gain and output voltage swing.',
        'Add a bypass capacitor across R<sub>S</sub> to increase gain for AC signals.',
        'Measure the quiescent drain current to verify the bias point is correctly established.'
      ]
    },
    'schmitt-trigger': {
      title: 'Schmitt Trigger Circuit',
      image: 'images/schmitt_trigger.svg',
      description: 'A Schmitt trigger is a comparator circuit with hysteresis, meaning it has different threshold voltages for rising and falling input signals. This characteristic makes it excellent for noise immunity and converting slowly varying input signals to clean digital outputs. It is commonly used in signal conditioning and waveform generation.',
      formulas: [
        {
          name: 'Upper Threshold Voltage (Positive Feedback)',
          formula: 'V<sub>UT</sub> = (R<sub>2</sub>/(R<sub>1</sub> + R<sub>2</sub>)) × V<sub>out,high</sub>',
          description: 'The input voltage at which the output switches from high to low.'
        },
        {
          name: 'Lower Threshold Voltage (Positive Feedback)',
          formula: 'V<sub>LT</sub> = (R<sub>2</sub>/(R<sub>1</sub> + R<sub>2</sub>)) × V<sub>out,low</sub>',
          description: 'The input voltage at which the output switches from low to high.'
        },
        {
          name: 'Hysteresis',
          formula: 'V<sub>H</sub> = V<sub>UT</sub> - V<sub>LT</sub>',
          description: 'The difference between upper and lower threshold voltages.'
        }
      ],
      instructions: [
        'Select R<sub>1</sub> and R<sub>2</sub> to achieve the desired hysteresis window based on your noise environment.',
        'For inverting configuration, apply the input to the negative input terminal.',
        'For non-inverting configuration, apply the input to the positive input terminal.',
        'Verify operation by applying a slow triangle wave and observing the sharp transitions at the threshold points.',
        'Test with noisy signals to confirm noise immunity within the hysteresis band.'
      ]
    },
    'sequential-logic': {
      title: 'Sequential Logic Circuit',
      image: 'images/sequential_logic.svg',
      description: 'Sequential logic circuits, unlike combinational logic, incorporate memory elements that store state information. The D flip-flop is a fundamental sequential building block used in registers, counters, and state machines. The output depends not only on current inputs but also on the history of inputs.',
      formulas: [
        {
          name: 'D Flip-Flop Characteristic Equation',
          formula: 'Q<sub>next</sub> = D',
          description: 'The next state (Q) after a clock edge equals the D input value at that edge.'
        },
        {
          name: 'Setup Time',
          formula: 't<sub>setup</sub>',
          description: 'Minimum time before the clock edge that D must be stable.'
        },
        {
          name: 'Hold Time',
          formula: 't<sub>hold</sub>',
          description: 'Minimum time after the clock edge that D must remain stable.'
        }
      ],
      instructions: [
        'Connect the D input with the data to be stored at the next clock edge.',
        'Ensure the clock signal meets minimum pulse width and frequency specifications.',
        'Respect setup and hold time requirements to avoid metastability issues.',
        'For cascaded flip-flops, verify that the clock-to-Q delay plus setup time is less than the clock period.',
        'Test the circuit with various data patterns to verify correct operation.'
      ]
    },
    'pll': {
      title: 'Phase-Locked Loop (PLL)',
      image: 'images/pll.svg',
      description: 'A Phase-Locked Loop (PLL) is a control system that generates an output signal whose phase is related to the phase of an input signal. It consists of a phase detector, loop filter, voltage-controlled oscillator (VCO), and potentially a frequency divider. PLLs are widely used for clock generation, recovery, and frequency synthesis.',
      formulas: [
        {
          name: 'Lock Range',
          formula: 'Δω<sub>L</sub> = 2 × K<sub>0</sub> × K<sub>d</sub>',
          description: 'The range of frequencies over which the PLL can maintain lock once acquired.'
        },
        {
          name: 'Capture Range',
          formula: 'Δω<sub>C</sub> = 2 × K<sub>0</sub> × K<sub>d</sub> / √(1 + (ω<sub>n</sub>/ω<sub>L</sub>)<sup>2</sup>)',
          description: 'The range of frequencies over which the PLL can acquire lock from an unlocked condition.'
        },
        {
          name: 'Output Frequency with Divider',
          formula: 'f<sub>out</sub> = N × f<sub>in</sub>',
          description: 'Where N is the division ratio in the feedback path.'
        }
      ],
      instructions: [
        'Design the loop filter bandwidth to balance between acquisition time and output jitter.',
        'Select appropriate VCO gain and phase detector gain for the desired lock range.',
        'For frequency synthesis, calculate the necessary division ratio N to achieve the target output frequency.',
        'Test for lock acquisition with step changes in input frequency within the expected capture range.',
        'Measure phase noise and jitter performance under various operating conditions.'
      ]
    }
  };
  
  // Add click event listeners to circuit cards
  circuitCards.forEach(card => {
    card.addEventListener('click', function() {
      const circuitId = this.getAttribute('data-circuit');
      const circuitInfo = circuitData[circuitId];
      
      if (circuitInfo) {
        // Update modal content
        modalImage.src = circuitInfo.image;
        modalTitle.textContent = circuitInfo.title;
        modalDescription.textContent = circuitInfo.description;
        
        // Add formulas
        modalFormulas.innerHTML = '';
        circuitInfo.formulas.forEach(formula => {
          const formulaBlock = document.createElement('div');
          formulaBlock.className = 'formula-block';
          formulaBlock.innerHTML = `
            <div class="formula-name">${formula.name}</div>
            <div class="formula">${formula.formula}</div>
            <div class="formula-description">${formula.description}</div>
          `;
          modalFormulas.appendChild(formulaBlock);
        });
        
        // Add instructions
        modalInstructions.innerHTML = '';
        circuitInfo.instructions.forEach(instruction => {
          const li = document.createElement('li');
          li.innerHTML = instruction;
          modalInstructions.appendChild(li);
        });
        
        // Show modal
        circuitModal.classList.add('active');
        
        // Animate modal content
        setTimeout(() => {
          modalContent.classList.add('active');
        }, 10);
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal when clicking the close button
  closeModal.addEventListener('click', function() {
    modalContent.classList.remove('active');
    setTimeout(() => {
      circuitModal.classList.remove('active');
      document.body.style.overflow = '';
    }, 300);
  });
  
  // Close modal when clicking outside of modal content
  circuitModal.addEventListener('click', function(e) {
    if (e.target === circuitModal) {
      modalContent.classList.remove('active');
      setTimeout(() => {
        circuitModal.classList.remove('active');
        document.body.style.overflow = '';
      }, 300);
    }
  });
  
  // Setup modal tabs
  const modalTabs = document.querySelectorAll('.modal-tab');
  modalTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      modalTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding content
      const tabName = this.getAttribute('data-tab');
      const tabContents = document.querySelectorAll('.modal-tab-content');
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName) {
          content.classList.add('active');
        }
      });
    });
  });
}

// Email validation helper function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
} 