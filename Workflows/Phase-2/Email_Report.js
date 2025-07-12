function debugLog(message, data) {
    console.log(`[DEBUG] ${message}:`, JSON.stringify(data, null, 2));
}

// Get input data with proper error handling
let inputData;
try {
    inputData = $input.all();
    debugLog("Raw input data", inputData);
} catch (error) {
    debugLog("Error getting input", error.message);
    return [{ json: { error: "Failed to get input data", details: error.message } }];
}

// Extract the actual report content based on your specific structure
function extractReportContent(inputData) {
    let reportContent = "";
    
    // Handle different input structures
    if (Array.isArray(inputData) && inputData.length > 0) {
        const firstItem = inputData[0];
        
        if (firstItem.json) {
            // Handle n8n JSON structure
            if (typeof firstItem.json === 'string') {
                reportContent = firstItem.json;
            } else if (firstItem.json.output) {
                reportContent = firstItem.json.output;
            } else if (Array.isArray(firstItem.json)) {
                // Handle array of outputs like in your example
                reportContent = firstItem.json.map(item => 
                    typeof item === 'string' ? item : 
                    item.output || JSON.stringify(item)
                ).join('\n\n');
            } else {
                reportContent = JSON.stringify(firstItem.json);
            }
        } else if (typeof firstItem === 'string') {
            reportContent = firstItem;
        } else {
            reportContent = JSON.stringify(firstItem);
        }
    } else if (typeof inputData === 'string') {
        reportContent = inputData;
    } else {
        reportContent = JSON.stringify(inputData);
    }
    
    debugLog("Extracted report content", reportContent);
    return reportContent;
}

// New: Dynamic, flexible metrics extraction from report text
function extractMetricsDynamic(reportText) {
    // Normalize text
    const cleanText = reportText
        .replace(/\*\*/g, '')    // remove bold markdown
        .replace(/\*/g, '')      // remove bullet markdown
        .replace(/\n/g, ' ')     // convert newlines to spaces
        .replace(/\s+/g, ' ')    // collapse spaces
        .toLowerCase();

    const metrics = {
        totalTargeted: null,
        emailsClicked: null,
        dataSubmitted: null,
        clickRate: null,
        submissionRate: null,
    };

    const keysMap = {
        totalTargeted: ['total users targeted', 'emails sent', 'users targeted'],
        emailsClicked: ['users who clicked', 'phishing link clicked', 'links clicked', 'clicked malicious link'],
        dataSubmitted: ['users who submitted', 'sensitive data submitted', 'credentials submitted'],
        clickRate: ['campaign click rate', 'phishing link clicked', 'click rate'],
        submissionRate: ['campaign data submission rate', 'data submission rate', 'submission rate'],
    };

    function extractNumber(line) {
        const numMatch = line.match(/[\d.]+/);
        return numMatch ? parseFloat(numMatch[0]) : null;
    }

    const lines = reportText.split('\n');
    for (const line of lines) {
        const lower = line.toLowerCase();

        for (const [metric, keywords] of Object.entries(keysMap)) {
            if (metrics[metric] === null) {
                if (keywords.some(k => lower.includes(k))) {
                    const val = extractNumber(line);
                    if (val !== null) {
                        metrics[metric] = val;
                        break;
                    }
                }
            }
        }
    }

    // Infer missing rates if possible
    if (metrics.totalTargeted && !metrics.clickRate && metrics.emailsClicked !== null) {
        metrics.clickRate = parseFloat(((metrics.emailsClicked / metrics.totalTargeted) * 100).toFixed(1));
    }
    if (metrics.totalTargeted && !metrics.submissionRate && metrics.dataSubmitted !== null) {
        metrics.submissionRate = parseFloat(((metrics.dataSubmitted / metrics.totalTargeted) * 100).toFixed(1));
    }

    // Fallback zeros
    for (const key of Object.keys(metrics)) {
        if (metrics[key] === null) {
            metrics[key] = 0;
        }
    }

    debugLog("Extracted dynamic metrics", metrics);
    return metrics;
}

// Campaign name extraction (unchanged, but can be adapted if needed)
function extractCampaignName(reportText) {
    const patterns = [
        /Campaign[:\s-]+([^,\n\r."]+)/i,
        /Phishing Simulation Report[:\s-]+([^,\n\r."]+)/i,
        /Simulation[:\s-]+([^,\n\r."]+)/i,
        /"([^"]*Campaign[^"]*)"?/i,
        /Campaign\s*-\s*(\d+)/i
    ];
    
    for (const pattern of patterns) {
        const match = reportText.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }
    
    return `Campaign ${new Date().toISOString().split('T')[0]}`;
}

// Risk assessment function (unchanged)
function calculateRiskLevel(metrics) {
    const { clickRate, submissionRate } = metrics;
    
    if (clickRate >= 50 || submissionRate >= 50) {
        return { level: 'CRITICAL', color: '#DC3545', icon: '🚨', priority: 1 };
    } else if (clickRate >= 30 || submissionRate >= 30) {
        return { level: 'HIGH', color: '#FD7E14', icon: '⚠️', priority: 2 };
    } else if (clickRate >= 15 || submissionRate >= 15) {
        return { level: 'MEDIUM', color: '#FFC107', icon: '🔶', priority: 3 };
    } else {
        return { level: 'LOW', color: '#28A745', icon: '✅', priority: 4 };
    }
}

// HTML Report Generation Function (unchanged)
function generateHTMLEmailReport(campaignName, riskLevel, metrics, reportDate) {
    const conversionRate = metrics.emailsClicked > 0 ? 
        parseFloat((metrics.dataSubmitted / metrics.emailsClicked * 100).toFixed(1)) : 0;
    
    const unaffectedUsers = Math.max(0, metrics.totalTargeted - metrics.emailsClicked);
    const unaffectedRate = metrics.totalTargeted > 0 ? 
        parseFloat(((metrics.totalTargeted - metrics.emailsClicked) / metrics.totalTargeted * 100).toFixed(1)) : 0;

    return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 1.8em; font-weight: 300;">${riskLevel.icon} Phishing Simulation Report</h1>
            <h2 style="margin: 10px 0; font-size: 1.3em; font-weight: 400;">${campaignName}</h2>
            <div style="display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 1.1em; color: white; background: ${riskLevel.color}; margin: 10px 0;">
                ${riskLevel.level} RISK LEVEL
            </div>
        </div>

        <!-- Key Metrics -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 30px 0;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid ${riskLevel.color};">
                <div style="font-size: 2.2em; font-weight: bold; color: ${riskLevel.color}; margin: 10px 0;">${metrics.totalTargeted}</div>
                <div style="font-size: 0.9em; color: #666; text-transform: uppercase; letter-spacing: 1px;">Total Targeted</div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid ${riskLevel.color};">
                <div style="font-size: 2.2em; font-weight: bold; color: ${riskLevel.color}; margin: 10px 0;">${metrics.clickRate}%</div>
                <div style="font-size: 0.9em; color: #666; text-transform: uppercase; letter-spacing: 1px;">Click Rate</div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin: 10px 0; overflow: hidden;">
                    <div style="height: 100%; background: ${riskLevel.color}; width: ${metrics.clickRate}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid ${riskLevel.color};">
                <div style="font-size: 2.2em; font-weight: bold; color: ${riskLevel.color}; margin: 10px 0;">${metrics.submissionRate}%</div>
                <div style="font-size: 0.9em; color: #666; text-transform: uppercase; letter-spacing: 1px;">Submission Rate</div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin: 10px 0; overflow: hidden;">
                    <div style="height: 100%; background: ${riskLevel.color}; width: ${metrics.submissionRate}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid ${riskLevel.color};">
                <div style="font-size: 2.2em; font-weight: bold; color: ${riskLevel.color}; margin: 10px 0;">${conversionRate}%</div>
                <div style="font-size: 0.9em; color: #666; text-transform: uppercase; letter-spacing: 1px;">Conversion Rate</div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin: 10px 0; overflow: hidden;">
                    <div style="height: 100%; background: ${riskLevel.color}; width: ${conversionRate}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        </div>

        <!-- Executive Summary -->
        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.4em;">📊 Executive Summary</h2>
            <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; border-radius: 4px;">
                <strong>Risk Assessment:</strong> ${riskLevel.level} Risk - ${metrics.clickRate}% of users clicked phishing links
            </div>
            <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; border-radius: 4px;">
                <strong>Key Finding:</strong> ${metrics.emailsClicked} out of ${metrics.totalTargeted} users clicked malicious links
            </div>
            <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; border-radius: 4px;">
                <strong>Data Compromise:</strong> ${metrics.dataSubmitted} users submitted sensitive credentials
            </div>
            <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; border-radius: 4px;">
                <strong>Conversion Impact:</strong> ${conversionRate}% conversion rate from click to data submission
            </div>
            <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; border-radius: 4px;">
                <strong>Resilience:</strong> ${unaffectedUsers} users (${unaffectedRate}%) were not affected
            </div>
        </div>

        <!-- Immediate Actions -->
        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.4em;">🚨 Immediate Actions Required</h2>
            ${riskLevel.level === 'CRITICAL' ? 
                `<div style="background: #f8d7da; padding: 12px; margin: 8px 0; border-left: 4px solid #dc3545; border-radius: 4px;">
                    <strong>🔒 Reset passwords for all affected users immediately</strong>
                </div>
                <div style="background: #f8d7da; padding: 12px; margin: 8px 0; border-left: 4px solid #dc3545; border-radius: 4px;">
                    <strong>📢 Implement emergency security briefing within 24 hours</strong>
                </div>
                <div style="background: #f8d7da; padding: 12px; margin: 8px 0; border-left: 4px solid #dc3545; border-radius: 4px;">
                    <strong>👁️ Enable enhanced monitoring for affected accounts</strong>
                </div>
                <div style="background: #f8d7da; padding: 12px; margin: 8px 0; border-left: 4px solid #dc3545; border-radius: 4px;">
                    <strong>🔧 Update phishing filters and email gateway rules</strong>
                </div>`
                : `<div style="background: #fff3cd; padding: 12px; margin: 8px 0; border-left: 4px solid #ffc107; border-radius: 4px;">
                    <strong>💡 Schedule targeted security awareness training sessions</strong>
                </div>`
            }
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 0.9em; color: #aaa; margin-top: 30px;">
            Report generated on ${reportDate} by n8n AI Agent
        </div>
    </div>
</div>
`;
}

// Main workflow execution
try {
    const reportText = extractReportContent(inputData);
    const campaignName = extractCampaignName(reportText);
    const metrics = extractMetricsDynamic(reportText);
    const riskLevel = calculateRiskLevel(metrics);
    const reportDate = new Date().toLocaleDateString('en-GB');

    const htmlReport = generateHTMLEmailReport(campaignName, riskLevel, metrics, reportDate);

    // Prepare final output object with raw metrics and html formatted report
    const result = {
        campaignName,
        riskLevel: riskLevel.level,
        metrics,
        reportDate,
        htmlFormattedReport: htmlReport,
    };

    return [{ json: result }];

} catch (error) {
    return [{ json: { error: "Error processing report", details: error.message } }];
}
