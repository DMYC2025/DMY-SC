# DMYSC Admin Utility Tool (Python)

This directory contains powerful command-line utilities for club administrators to manage member data and financial reports beyond what's available in the web browser.

## Features
- **CSV Exporter**: Back up your entire member list to a local CSV file.
- **Financial PDF Generator**: Create professional-grade revenue summaries.
- **Recent Payment Monitor**: View the latest 10 payments in a clean table format.
- **Health Check**: Verify connection to the Supabase database.

## Setup Instructions

### 1. Requirements
Ensure you have **Python 3.8+** installed on your computer.

### 2. Install Dependencies
Open your terminal in this directory and run:
```bash
pip install -r requirements.txt
```

### 3. Run the Utility
Execute the script using:
```bash
python admin_utility.py
```

## Security Note
This tool uses the same API keys as your web application. Never share the `admin_utility.py` file with unauthorized users, as it contains sensitive database keys.

---
*Developed for Dream Makers Youth & Sports Club.*
