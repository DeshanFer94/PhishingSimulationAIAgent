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



