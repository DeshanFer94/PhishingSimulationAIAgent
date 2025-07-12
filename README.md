# Phishing Simulation Enhance using AIAgent

This project automates phishing simulation campaigns by integrating an AI Agent powered by Google Gemini LLM with GoPhish and n8n workflows. It enhances the realism, specificity, and effectiveness of phishing simulations through dynamic email and landing page generation, streamlined approval processes, and comprehensive executive reporting. The solution is designed to improve organizational security awareness by simulating realistic phishing scenarios and providing actionable insights.

## Features

- AI-Powered Phishing Template Generation: Automatically creates department-specific phishing emails and matching HTML landing pages using Google Gemini LLM for highly realistic simulations.
- Automated Approval Workflow: Sends generated templates to stakeholders via email for review and approval before campaign deployment.
- Scheduled Campaigns: Supports monthly phishing campaign generation and approval, typically scheduled between the 15th and 21st of each month (weekdays).
- Campaign Data Analysis: Retrieves GoPhish campaign data, analyzes user interactions (e.g., email opens, link clicks, form submissions), and calculates key metrics like click and submission rates.
- Executive Reporting: Produces polished, management-ready HTML reports with risk assessments, color-coded risk levels, behavioral insights, and recommended security actions.
- Automated Report Delivery: Emails analysis reports directly to management for seamless communication.
