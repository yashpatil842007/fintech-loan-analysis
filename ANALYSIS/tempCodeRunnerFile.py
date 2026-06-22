import pandas as pd

df = pd.read_csv(r'C:\Users\ASUS\OneDrive\Desktop\FINTECH LOAN\DATA\LoanDataset - LoansDatasest.csv')

print(df[['customer_income',
    'loan_amnt',
    'loan_int_rate',
    'customer_age',
    'cred_hist_length']].describe())
    


 