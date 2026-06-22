
import pandas as pd

try:
    df = pd.read_csv(r'C:\Users\ASUS\OneDrive\Desktop\FINTECH LOAN\DATA\FINTECH LOAN DATASET new.csv')
    print("File loaded successfully")
    print("Columns in dataset:", df.columns.tolist())
    
    # Convert to float, handling errors
    df['loan_int_rate'] = pd.to_numeric(df['loan_int_rate'], errors='coerce')
    df['loan_amnt'] = pd.to_numeric(df['loan_amnt'], errors='coerce')
    df['customer_income'] = pd.to_numeric(df['customer_income'], errors='coerce')
    df['customer_age'] = pd.to_numeric(df['customer_age'], errors='coerce')
    df['cred_hist_length'] = pd.to_numeric(df['cred_hist_length'], errors='coerce')
    
    # Interest Rate vs Loan Amount
    print("\n=== Interest Rate vs Loan Amount ===")
    print(df[['loan_int_rate', 'loan_amnt']].corr())
    
    # Income vs Loan Amount
    print("\n=== Income vs Loan Amount ===")
    print(df[['customer_income', 'loan_amnt']].corr())
    
    # Age vs Credit History
    print("\n=== Age vs Credit History ===")
    print(df[['customer_age', 'cred_hist_length']].corr())
    
except FileNotFoundError:
    print("ERROR: File not found. Check the file path and filename.")
except KeyError as e:
    print(f"ERROR: Column not found: {e}")
except Exception as e:
    print(f"ERROR: {e}")
