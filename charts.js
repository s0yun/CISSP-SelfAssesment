// GLOBAL CHART FUNCTIONS 

function generateAllDomainGraphs() {
    const domainIds = ['domain1', 'domain2', 'domain3', 'domain4', 'domain5', 'domain6', 'domain7', 'domain8']; // List all domain IDs

    // Call the generateDomainGraphs function for each domain
    domainIds.forEach(domainId => {
        generateDomainGraphs(domainId);
    });
}


// Function to generate or update radar charts for a specific domain
function generateDomainGraphs(domainId) {
    // Set the word limit for label line breaks
    const wordLimit = 3;

    // Function to split label into multiple lines based on word limit
    function splitLabelByWords(label, wordLimit) {
        const words = label.split(' ');
        let lines = [];
        for (let i = 0; i < words.length; i += wordLimit) {
            lines.push(words.slice(i, i + wordLimit).join(' '));
        }
        return lines;
    }

    // Find the domain section
    const domain = document.getElementById(domainId);

    // Collect scores only within this domain section
    const scores = Array.from(domain.querySelectorAll(`.${domainId}-score`)).map(input => {
        return parseInt(input.value) || 0; // Use 0 if no value is present
    });

    // Collect and process labels within this domain section
    const labels = Array.from(domain.querySelectorAll('.subtopic label')).map(label => {
        return splitLabelByWords(label.innerText, wordLimit); // Keep labels as arrays
    });

    // Get the canvas for this domain section
    const canvas = domain.querySelector('#' + domainId + '-chart');
    const ctx = canvas.getContext('2d');

    const domainNames = {
        domain1: 'Domain 1: Security and Risk Management',
        domain2: 'Domain 2: Asset Security',
        domain3: 'Domain 3: Security Architecture and Engineering',
        domain4: 'Domain 4: Communication and Network Security',
        domain5: 'Domain 5: Identity and Access Management',
        domain6: 'Domain 6: Security Assessment and Testing',
        domain7: 'Domain 7: Security Operations',
        domain8: 'Domain 8: Software Development Security',
    };

    // Check if the chart already exists
    if (canvas.chart) {
        // Update the existing chart
        canvas.chart.data.datasets[0].data = scores;
        canvas.chart.data.labels = labels
        canvas.chart.update(); // Update the chart to reflect new data
    } else {
        // Create the radar chart for this domain
        canvas.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Subtopic Scores for ${domainNames[domainId]}`, // Update label with domain name
                    data: scores,
                    backgroundColor: '#d9eeda',
                    borderColor: '#4CAF50',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 1,
                        max: 5
                    }
                }
            }
        });
    }

    // Show the canvas after generating/updating the chart
    canvas.removeAttribute('hidden');
}

// Function to calculate the aggregate scores
function calculateAggregate(domainClass, outputId) {
    const scores = document.querySelectorAll(domainClass);
    let total = 0, count = 0;
    scores.forEach(input => {
        const score = parseInt(input.value);
        if (!isNaN(score)) {
            total += score;
            count++;
        }
    });
    const aggregate = (count > 0) ? (total / count).toFixed(2) : 0;
    return parseFloat(aggregate);
}

// Function to generate all results graphs
function generateaverages() {
    generateAllDomainGraphs();
    // Calculate aggregate scores for each domain
    const domain1Aggregate = calculateAggregate('.domain1-score', 'domain1-aggregate');
    const domain2Aggregate = calculateAggregate('.domain2-score', 'domain2-aggregate');
    const domain3Aggregate = calculateAggregate('.domain3-score', 'domain3-aggregate');
    const domain4Aggregate = calculateAggregate('.domain4-score', 'domain4-aggregate');
    const domain5Aggregate = calculateAggregate('.domain5-score', 'domain5-aggregate');
    const domain6Aggregate = calculateAggregate('.domain6-score', 'domain6-aggregate');
    const domain7Aggregate = calculateAggregate('.domain7-score', 'domain7-aggregate');
    const domain8Aggregate = calculateAggregate('.domain8-score', 'domain8-aggregate');
    // Display Spider Graph
    const ctx = document.getElementById('domain-average').getContext('2d');
    if (window.generatedChart) {
        window.generatedChart.destroy(); // Destroy the previous chart if it exists
    }
    window.generatedChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Security and Risk Management',
                'Asset Security',
                'Security Architecture and Engineering',
                'Communication and Network Security',
                'Identity and Access Management (IAM)',
                'Security Assessment and Testing',
                'Security Operations',
                'Software Development Security'
            ],
            datasets: [{
                label: 'CISSP Self-Assessment',
                data: [domain1Aggregate, domain2Aggregate, domain3Aggregate, domain4Aggregate, domain5Aggregate, domain6Aggregate, domain7Aggregate, domain8Aggregate],
                backgroundColor: '#d9eeda',
                borderColor: '#4CAF50',
                borderWidth: 1
            }]
        },
        options: {
            scale: {
                ticks: { beginAtZero: true, max: 5 }
            }
        }
    });
}