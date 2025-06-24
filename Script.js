// Enhanced Power Platform Licensing Cost Calculator
// With dynamic pricing settings and improved UX

// Default pricing constants (monthly costs)
const DEFAULT_PRICING = {
    powerApps: 20,           // Power Apps Premium per user
    powerAutomate: 15,       // Power Automate Premium per user
    copilotStudio: 0,        // Copilot Studio User (Free)
    developerPlan: 0,        // Power Apps Developer Plan (Free)
    m365Copilot: 30,         // Microsoft 365 Copilot per user
    messagePacks: 200,       // Copilot Studio Message Packs each
    aiBuilderPacks: 500,     // AI Builder Capacity Packs each
    flowPacks: 100,          // Power Automate Per Flow Packs each
    rpaBots: 215             // Hosted RPA Bots each
};

// Current pricing (can be customized)
let currentPricing = { ...DEFAULT_PRICING };

// Tab switching functionality
function switchTab(tabName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected page
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
    
    // If switching to settings, load current pricing
    if (tabName === 'settings') {
        loadPricingToSettings();
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

// Load pricing from localStorage or use defaults
function loadPricing() {
    const savedPricing = localStorage.getItem('powerPlatformPricing');
    if (savedPricing) {
        try {
            currentPricing = { ...DEFAULT_PRICING, ...JSON.parse(savedPricing) };
        } catch (e) {
            console.warn('Failed to load saved pricing, using defaults');
            currentPricing = { ...DEFAULT_PRICING };
        }
    }
    updatePricingDisplay();
}

// Save pricing to localStorage
function savePricing() {
    try {
        // Get values from settings inputs
        currentPricing.powerApps = parseFloat(document.getElementById('powerAppsPriceInput').value) || 0;
        currentPricing.powerAutomate = parseFloat(document.getElementById('powerAutomatePriceInput').value) || 0;
        currentPricing.m365Copilot = parseFloat(document.getElementById('m365CopilotPriceInput').value) || 0;
        currentPricing.messagePacks = parseFloat(document.getElementById('messagePacksPriceInput').value) || 0;
        currentPricing.aiBuilderPacks = parseFloat(document.getElementById('aiBuilderPacksPriceInput').value) || 0;
        currentPricing.flowPacks = parseFloat(document.getElementById('flowPacksPriceInput').value) || 0;
        currentPricing.rpaBots = parseFloat(document.getElementById('rpaBotsPriceInput').value) || 0;
        
        localStorage.setItem('powerPlatformPricing', JSON.stringify(currentPricing));
        updatePricingDisplay();
        calculateCosts();
        
        // Show success message
        showNotification('Custom pricing saved successfully!', 'success');
    } catch (e) {
        showNotification('Failed to save pricing settings', 'error');
    }
}

// Reset to default pricing
function resetToDefaults() {
    currentPricing = { ...DEFAULT_PRICING };
    localStorage.removeItem('powerPlatformPricing');
    loadPricingToSettings();
    updatePricingDisplay();
    calculateCosts();
    showNotification('Pricing reset to defaults', 'info');
}

// Load current pricing into settings inputs
function loadPricingToSettings() {
    document.getElementById('powerAppsPriceInput').value = currentPricing.powerApps;
    document.getElementById('powerAutomatePriceInput').value = currentPricing.powerAutomate;
    document.getElementById('m365CopilotPriceInput').value = currentPricing.m365Copilot;
    document.getElementById('messagePacksPriceInput').value = currentPricing.messagePacks;
    document.getElementById('aiBuilderPacksPriceInput').value = currentPricing.aiBuilderPacks;
    document.getElementById('flowPacksPriceInput').value = currentPricing.flowPacks;
    document.getElementById('rpaBotsPriceInput').value = currentPricing.rpaBots;
}

// Update pricing display in calculator
function updatePricingDisplay() {
    document.getElementById('powerAppsPrice').textContent = `$${currentPricing.powerApps}`;
    document.getElementById('powerAutomatePrice').textContent = `$${currentPricing.powerAutomate}`;
    document.getElementById('m365CopilotPrice').textContent = `$${currentPricing.m365Copilot}`;
    document.getElementById('messagePacksPrice').textContent = `$${currentPricing.messagePacks}`;
    document.getElementById('aiBuilderPacksPrice').textContent = `$${currentPricing.aiBuilderPacks}`;
    document.getElementById('flowPacksPrice').textContent = `$${currentPricing.flowPacks}`;
    document.getElementById('rpaBotsPrice').textContent = `$${currentPricing.rpaBots}`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#107C10',
        error: '#D83B01',
        info: '#0078D4',
        warning: '#FF8C00'
    };
    notification.style.background = colors[type] || colors.info;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Calculate costs based on current inputs and pricing
function calculateCosts() {
    // Get input values
    const developerCount = parseInt(document.getElementById('developerCount').value) || 0;
    const powerAppsEnabled = document.getElementById('powerApps').checked;
    const powerAutomateEnabled = document.getElementById('powerAutomate').checked;
    const copilotStudioEnabled = document.getElementById('copilotStudio').checked;
    const developerPlanEnabled = document.getElementById('developerPlan').checked;
    const m365CopilotEnabled = document.getElementById('m365Copilot').checked;
    
    const messagePacks = parseInt(document.getElementById('messagePacks').value) || 0;
    const aiBuilderPacks = parseInt(document.getElementById('aiBuilderPacks').value) || 0;
    const flowPacks = parseInt(document.getElementById('flowPacks').value) || 0;
    const rpaBots = parseInt(document.getElementById('rpaBots').value) || 0;

    // Calculate per-user license costs using current pricing
    let powerAppsCost = powerAppsEnabled ? developerCount * currentPricing.powerApps : 0;
    let powerAutomateCost = powerAutomateEnabled ? developerCount * currentPricing.powerAutomate : 0;
    let copilotStudioCost = copilotStudioEnabled ? developerCount * currentPricing.copilotStudio : 0;
    let developerPlanCost = developerPlanEnabled ? developerCount * currentPricing.developerPlan : 0;
    let m365CopilotCost = m365CopilotEnabled ? developerCount * currentPricing.m365Copilot : 0;

    // Calculate tenant-wide costs using current pricing
    let messagePacksCost = messagePacks * currentPricing.messagePacks;
    let aiBuilderPacksCost = aiBuilderPacks * currentPricing.aiBuilderPacks;
    let flowPacksCost = flowPacks * currentPricing.flowPacks;
    let rpaBotsCost = rpaBots * currentPricing.rpaBots;

    // Calculate subtotals
    let perUserSubtotal = powerAppsCost + powerAutomateCost + copilotStudioCost + developerPlanCost;
    let tenantSubtotal = messagePacksCost + aiBuilderPacksCost + flowPacksCost + rpaBotsCost;
    let totalCost = perUserSubtotal + tenantSubtotal + m365CopilotCost;

    // Update the display
    document.getElementById('powerAppsCost').textContent = formatCurrency(powerAppsCost);
    document.getElementById('powerAutomateCost').textContent = formatCurrency(powerAutomateCost);
    document.getElementById('copilotStudioCost').textContent = formatCurrency(copilotStudioCost);
    document.getElementById('developerPlanCost').textContent = formatCurrency(developerPlanCost);
    document.getElementById('m365CopilotCost').textContent = formatCurrency(m365CopilotCost);
    
    document.getElementById('messagePacksCost').textContent = formatCurrency(messagePacksCost);
    document.getElementById('aiBuilderPacksCost').textContent = formatCurrency(aiBuilderPacksCost);
    document.getElementById('flowPacksCost').textContent = formatCurrency(flowPacksCost);
    document.getElementById('rpaBotsCost').textContent = formatCurrency(rpaBotsCost);
    
    document.getElementById('perUserSubtotal').textContent = formatCurrency(perUserSubtotal);
    document.getElementById('tenantSubtotal').textContent = formatCurrency(tenantSubtotal);
    document.getElementById('totalCost').textContent = formatCurrency(totalCost);

    // Show/hide M365 Copilot row based on selection
    const m365Row = document.getElementById('m365CopilotRow');
    if (m365CopilotEnabled) {
        m365Row.style.display = 'flex';
    } else {
        m365Row.style.display = 'none';
    }

    // Update cost item visibility based on checkbox states
    updateCostItemVisibility();
}

// Update visibility of cost items based on checkbox states
function updateCostItemVisibility() {
    const costItems = document.querySelectorAll('.cost-item');
    
    costItems.forEach(item => {
        const span = item.querySelector('span');
        if (span) {
            const text = span.textContent.toLowerCase();
            
            // Hide items that are not selected
            if (text.includes('power apps premium') && !document.getElementById('powerApps').checked) {
                item.style.display = 'none';
            } else if (text.includes('power automate premium') && !document.getElementById('powerAutomate').checked) {
                item.style.display = 'none';
            } else if (text.includes('copilot studio user') && !document.getElementById('copilotStudio').checked) {
                item.style.display = 'none';
            } else if (text.includes('power apps developer plan') && !document.getElementById('developerPlan').checked) {
                item.style.display = 'none';
            } else if (!text.includes('microsoft 365 copilot') && !text.includes('subtotal') && !text.includes('total')) {
                item.style.display = 'flex';
            }
        }
    });
}

// Add event listeners for real-time updates
function setupEventListeners() {
    // Add event listeners to calculator inputs
    const calculatorInputs = document.querySelectorAll('#calculator input');
    calculatorInputs.forEach(input => {
        if (input.type === 'number') {
            input.addEventListener('input', calculateCosts);
        } else if (input.type === 'checkbox') {
            input.addEventListener('change', calculateCosts);
        }
    });
    
    // Add event listeners to settings inputs for real-time preview
    const settingsInputs = document.querySelectorAll('#settings input[type="number"]');
    settingsInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Update pricing temporarily for preview
            const tempPricing = { ...currentPricing };
            tempPricing.powerApps = parseFloat(document.getElementById('powerAppsPriceInput').value) || 0;
            tempPricing.powerAutomate = parseFloat(document.getElementById('powerAutomatePriceInput').value) || 0;
            tempPricing.m365Copilot = parseFloat(document.getElementById('m365CopilotPriceInput').value) || 0;
            tempPricing.messagePacks = parseFloat(document.getElementById('messagePacksPriceInput').value) || 0;
            tempPricing.aiBuilderPacks = parseFloat(document.getElementById('aiBuilderPacksPriceInput').value) || 0;
            tempPricing.flowPacks = parseFloat(document.getElementById('flowPacksPriceInput').value) || 0;
            tempPricing.rpaBots = parseFloat(document.getElementById('rpaBotsPriceInput').value) || 0;
            
            // Update display with temporary pricing
            document.getElementById('powerAppsPrice').textContent = `$${tempPricing.powerApps}`;
            document.getElementById('powerAutomatePrice').textContent = `$${tempPricing.powerAutomate}`;
            document.getElementById('m365CopilotPrice').textContent = `$${tempPricing.m365Copilot}`;
            document.getElementById('messagePacksPrice').textContent = `$${tempPricing.messagePacks}`;
            document.getElementById('aiBuilderPacksPrice').textContent = `$${tempPricing.aiBuilderPacks}`;
            document.getElementById('flowPacksPrice').textContent = `$${tempPricing.flowPacks}`;
            document.getElementById('rpaBotsPrice').textContent = `$${tempPricing.rpaBots}`;
        });
    });
}

// Preset configurations
function loadPreset(preset) {
    switch(preset) {
        case 'small':
            document.getElementById('developerCount').value = 50;
            document.getElementById('messagePacks').value = 1;
            document.getElementById('aiBuilderPacks').value = 1;
            document.getElementById('flowPacks').value = 2;
            document.getElementById('rpaBots').value = 5;
            break;
        case 'medium':
            document.getElementById('developerCount').value = 200;
            document.getElementById('messagePacks').value = 1;
            document.getElementById('aiBuilderPacks').value = 1;
            document.getElementById('flowPacks').value = 3;
            document.getElementById('rpaBots').value = 10;
            break;
        case 'large':
            document.getElementById('developerCount').value = 800;
            document.getElementById('messagePacks').value = 2;
            document.getElementById('aiBuilderPacks').value = 2;
            document.getElementById('flowPacks').value = 5;
            document.getElementById('rpaBots').value = 25;
            break;
        case 'enterprise':
            document.getElementById('developerCount').value = 2000;
            document.getElementById('messagePacks').value = 5;
            document.getElementById('aiBuilderPacks').value = 5;
            document.getElementById('flowPacks').value = 10;
            document.getElementById('rpaBots').value = 50;
            document.getElementById('m365Copilot').checked = true;
            break;
    }
    calculateCosts();
}

// Export results to CSV
function exportToCSV() {
    const developerCount = document.getElementById('developerCount').value;
    const powerAppsCost = document.getElementById('powerAppsCost').textContent;
    const powerAutomateCost = document.getElementById('powerAutomateCost').textContent;
    const totalCost = document.getElementById('totalCost').textContent;
    
    const csvContent = `Power Platform Licensing Cost Estimate
Developer Count,${developerCount}
Power Apps Premium,${powerAppsCost}
Power Automate Premium,${powerAutomateCost}
Total Monthly Cost,${totalCost}
Generated on,${new Date().toLocaleDateString()}
Custom Pricing Used,${localStorage.getItem('powerPlatformPricing') ? 'Yes' : 'No'}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'power_platform_cost_estimate.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPricing();
    setupEventListeners();
    calculateCosts(); // Calculate initial costs
    
    // Show welcome message if first time user
    if (!localStorage.getItem('powerPlatformVisited')) {
        setTimeout(() => {
            showNotification('Welcome! Use the Settings tab to customize pricing.', 'info');
            localStorage.setItem('powerPlatformVisited', 'true');
        }, 1000);
    }
});

