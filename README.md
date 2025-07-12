# Phishing Simulation Enhance using AIAgent

This project automates phishing simulation campaigns by integrating an AI Agent powered by Google Gemini LLM with GoPhish and n8n workflows. It enhances the realism, specificity, and effectiveness of phishing simulations through dynamic email and landing page generation, streamlined approval processes, and comprehensive executive reporting. The solution is designed to improve organizational security awareness by simulating realistic phishing scenarios and providing actionable insights.

## Features

- AI-Powered Phishing Template Generation: Automatically creates department-specific phishing emails and matching HTML landing pages using Google Gemini LLM for highly realistic simulations.
- Automated Approval Workflow: Sends generated templates to stakeholders via email for review and approval before campaign deployment.
- Scheduled Campaigns: Supports monthly phishing campaign generation and approval, typically scheduled between the 15th and 21st of each month (weekdays).
- Campaign Data Analysis: Retrieves GoPhish campaign data, analyzes user interactions (e.g., email opens, link clicks, form submissions), and calculates key metrics like click and submission rates.
- Executive Reporting: Produces polished, management-ready HTML reports with risk assessments, color-coded risk levels, behavioral insights, and recommended security actions.
- Automated Report Delivery: Emails analysis reports directly to management for seamless communication.


## Architecture & Workflow

### Phase 1: Phishing Email and Landing Page Generation with Approval 

<img width="1133" height="359" alt="Image" src="https://github.com/user-attachments/assets/6d89b28d-de0b-40de-b529-79f1311709b7" />

Trigger: Manual execution or scheduled monthly (15th–21st, weekdays).

Process:
Iterates through target departments (e.g., Finance, HR, IT).
Uses Google Gemini LLM to generate valid HTML phishing emails and landing pages tailored to each department.
Parses AI-generated output to extract templates and content.
Sends approval requests with generated content to stakeholders via email.
Outcome: Approved templates ready for deployment in GoPhish campaigns.

### Phase 2: Campaign Results Retrieval, Analysis, and Reporting

<img width="1181" height="370" alt="Image" src="https://github.com/user-attachments/assets/6dec473d-a2c9-48cd-b2d2-0b353bb7f208" />

Trigger: Cron job, typically in the 4th week of each month.

Process:
Retrieves campaign data via GoPhish API for the current month.
Analyzes user interactions (e.g., email opens, link clicks, data submissions).

Uses Gemini LLM to generate an executive HTML report, including:
Risk Assessment: Color-coded risk levels based on user interactions.
Key Metrics: Click rates, submission rates, and conversion rates.
Behavioral Insights: Patterns in user responses and vulnerabilities.
Recommendations: Actionable steps to improve security awareness.
Emails the HTML report to management.
Outcome: Comprehensive, automated reporting for stakeholders.

## Technologies Used
n8n: Workflow automation platform for orchestrating phishing simulation and reporting processes.
Google Gemini LLM: Large Language Model for generating realistic phishing content and executive reports.
GoPhish: Open-source phishing simulation framework for campaign management.
Gmail API: Handles email delivery for approval requests and final reports.
JavaScript: Used within n8n for data parsing, manipulation, and report formatting.

## Prerequisites
n8n Instance: A running n8n instance (cloud or self-hosted).
Google Gemini API: API key with access to the Gemini LLM.
GoPhish: Installed and configured with an API token.
Gmail API: OAuth credentials for sending emails via Gmail.
Node.js: For running any custom JavaScript within n8n workflows.

## Setup Instructions

### Configure Credentials in n8n:

Add Google Gemini API key in n8n credentials.
Set up GoPhish API token in n8n.
Configure Gmail OAuth credentials for email workflows.

### Import Workflows:

Import Phase1_workflow.json (email and landing page generation) and Phase2_workflow.json (data retrieval and reporting) into your n8n instance.
Find these files in the /workflows directory of the repository.

### Schedule Triggers:

Set Phase 1 to run monthly between the 15th and 21st (weekdays) using n8n’s schedule node.
Configure Phase 2 to run in the 4th week of each month via a cron job (e.g., 0 9 * * 1-5 for 9 AM, Monday–Friday).

### Test Workflows:

Run Phase 1 manually to verify email and landing page generation.
Send test approval emails and ensure content is correctly parsed.
Run Phase 2 to confirm data retrieval and report generation.

### Monitor and Review:

Check approval emails sent to stakeholders.
Review executive reports delivered to management.
Monitor GoPhish dashboard for campaign performance.

## Usage

Manual Execution: Trigger workflows manually in n8n for testing or ad-hoc campaigns.
Scheduled Execution: Rely on configured schedules for automated monthly campaigns.
Monitoring: Use n8n’s execution logs and GoPhish’s dashboard to track campaign progress and results.
Reports: Review HTML reports emailed to management for insights and follow-up actions.

## Future Enhancements

Dynamic Department Targeting: Integrate with HR databases to dynamically fetch department lists.
Adaptive Phishing Themes: Use AI to tailor phishing scenarios based on seasonal events or trending threats.
Feedback Loops: Incorporate user feedback to improve email and landing page realism over time.
Real-Time Dashboards: Develop interactive dashboards for ongoing campaign metrics and trends.



