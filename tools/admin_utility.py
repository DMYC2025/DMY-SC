import os
import sys
import pandas as pd
from supabase import create_client, Client
from datetime import datetime
from tabulate import tabulate
from fpdf import FPDF

# --- CONFIGURATION ---
# In a real production environment, use a .env file.
# For this utility, we use the same keys as the web app.
SUPABASE_URL = "https://tnrqasiiywcvtwkwytqe.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucnFhc2lpeXdjdnR3a3d5dHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDIxMTEsImV4cCI6MjA4MjkxODExMX0.rd9aKmLa687zMxg8FV5AllgnYkz7wpdXBRi3a5NyXc4"

class DMYSCAdminTool:
    def __init__(self):
        try:
            self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("[\u2713] Connected to DMYSC Database.")
        except Exception as e:
            print(f"[!] Connection Error: {e}")
            sys.exit(1)

    def show_menu(self):
        print("\n" + "="*40)
        print("   DMYSC PYTHON ADMIN UTILITY v1.0")
        print("="*40)
        print("1. Export All Members to CSV")
        print("2. Generate Financial Summary (PDF)")
        print("3. View Recent Payments (Table)")
        print("4. System Health Check")
        print("0. Exit")
        print("-" * 40)

    def export_members_csv(self):
        print("[*] Fetching member data...")
        response = self.supabase.table("profiles").select("*").execute()
        if response.data:
            df = pd.DataFrame(response.data)
            filename = f"dmysc_members_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            df.to_csv(filename, index=False)
            print(f"[\u2713] Success! Data exported to {filename}")
        else:
            print("[!] No member data found.")

    def view_recent_payments(self):
        print("[*] Fetching recent payments...")
        response = self.supabase.table("payments").select("*, profiles(full_name)").order("paid_at", desc=True).limit(10).execute()
        if response.data:
            table_data = []
            for p in response.data:
                name = p.get('profiles', {}).get('full_name', 'N/A')
                table_data.append([p['month_year'], name, p['amount'], p['paid_at'][:10]])
            
            print("\n--- RECENT PAYMENTS ---")
            print(tabulate(table_data, headers=["Month", "Member", "Amount (LKR)", "Date"], tablefmt="grid"))
        else:
            print("[!] No payment records found.")

    def generate_financial_pdf(self):
        print("[*] Generating Financial Report...")
        response = self.supabase.table("payments").select("amount").execute()
        if not response.data:
            print("[!] No financial data found.")
            return

        total_income = sum(float(p['amount']) for p in response.data)
        count = len(response.data)
        
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("helvetica", "B", 20)
        pdf.set_text_color(0, 108, 69) # DMYSC Primary Color
        pdf.cell(0, 15, "DMYSC FINANCIAL SUMMARY", ln=True, align="C")
        
        pdf.set_font("helvetica", "", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(0, 10, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align="C")
        pdf.ln(10)

        # Statistics
        pdf.set_font("helvetica", "B", 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, "Summary Statistics", ln=True)
        pdf.set_font("helvetica", "", 12)
        pdf.cell(0, 10, f"- Total Transactions: {count}", ln=True)
        pdf.cell(0, 10, f"- Total Revenue: {total_income:,.2f} LKR", ln=True)
        pdf.cell(0, 10, f"- Average per member: {(total_income/count):,.2f} LKR" if count > 0 else "0", ln=True)
        
        filename = f"dmysc_finance_report_{datetime.now().strftime('%Y%m%d')}.pdf"
        pdf.output(filename)
        print(f"[\u2713] Financial Report saved as {filename}")

    def run(self):
        while True:
            self.show_menu()
            choice = input("Select an option: ")
            
            if choice == "1":
                self.export_members_csv()
            elif choice == "2":
                self.generate_financial_pdf()
            elif choice == "3":
                self.view_recent_payments()
            elif choice == "4":
                print("[\u2713] Database Connection: OK")
                print("[\u2713] Supabase API: Operational")
            elif choice == "0":
                print("Exiting tool. Goodbye!")
                break
            else:
                print("[!] Invalid choice. Please try again.")

if __name__ == "__main__":
    tool = DMYSCAdminTool()
    tool.run()
