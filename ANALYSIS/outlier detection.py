import pandas as pd
import numpy as np
from scipy import stats

# Open file for writing output
output_file = r'C:\Users\ASUS\OneDrive\Desktop\FINTECH LOAN\ANALYSIS\analysis_output.txt'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("="*70 + "\n")
    f.write("FINTECH LOAN ANALYSIS OUTPUT\n")
    f.write("="*70 + "\n\n")

df = pd.read_csv(r'C:\Users\ASUS\OneDrive\Desktop\FINTECH LOAN\DATA\FINTECH LOAN DATASET new.csv')

numeric_columns = [
    'customer_age',
    'customer_income',
    'employment_duration',
    'loan_amnt',
    'loan_int_rate',
    'term_years',
    'cred_hist_length'
]

for col in numeric_columns:
    df[col] = (
        df[col]
        .astype(str)
        .str.replace(',', '', regex=False)
        .str.strip()
    )

    df[col] = pd.to_numeric(df[col], errors='coerce')

df.dropna(inplace=True)

with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n" + "="*70 + "\n")
    f.write("OUTLIER DETECTION - Z-SCORE ANALYSIS\n")
    f.write("="*70 + "\n\n")

for col in ['customer_income','loan_amnt','loan_int_rate']:
    z = np.abs(stats.zscore(df[col]))
    outliers = df[z > 3]
    
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(f"\n{col}:\n")
        f.write(f"Total Z-Score Outliers (|Z| > 3): {len(outliers)}\n")

# Debt burden ratio
df['Debt_Burden_Ratio'] = (
    df['loan_amnt'] /
    df['customer_income']
)

with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n" + "="*70 + "\n")
    f.write("DEBT BURDEN RATIO\n")
    f.write("="*70 + "\n\n")
    f.write(df[['customer_id', 'Debt_Burden_Ratio']].head().to_string())
    f.write("\n\nAnalysis completed successfully!")

print(f"✅ Output saved to: {output_file}")

#loan affordibility score
df['Loan_Affordability_Score'] = (
    df['customer_income']
    /
    df['loan_amnt']
) * 100

print(
    df[['customer_id',
        'Loan_Affordability_Score']]
    .head()
)

#LGD(loss given default)
LGD = 0.60

print(
    "Loss Given Default =",
    LGD
)

#EAD(exposure at default)
EAD = df['loan_amnt']

print(
    "Average EAD =",
    round(EAD.mean(),2)
)

#PD(probability of default)
PD = (0.05)

#expected loss
df['Expected_Loss'] = (
    PD *
    LGD *
    df['loan_amnt']
)

print(
    df[['customer_id',
        'Expected_Loss']]
    .head()
)
#total portfolio expected loss
total_expected_loss = (
    df['Expected_Loss']
    .sum()
)

print(
    "Total Portfolio Expected Loss =",
    round(total_expected_loss,2)
)
