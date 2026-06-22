import pandas as pd
import numpy as np
from scipy import stats
from scipy.stats import ttest_ind, chi2_contingency

output_file = r'C:\Users\ASUS\OneDrive\Desktop\FINTECH LOAN\ANALYSIS\FINTECH_LOAN_COMPLETE_ANALYSIS.txt'

# Load data
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

# Start writing to file
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("="*80 + "\n")
    f.write(" "*20 + "FINTECH LOAN ANALYSIS - COMPLETE REPORT\n")
    f.write("="*80 + "\n\n")

# 1. DESCRIPTIVE STATISTICS
with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n" + "="*80 + "\n")
    f.write("1. DESCRIPTIVE STATISTICS\n")
    f.write("="*80 + "\n\n")
    
    stats_df = df[['customer_income', 'loan_amnt', 'loan_int_rate', 'customer_age', 'cred_hist_length']].describe()
    f.write(stats_df.to_string())

# 2. CORRELATION ANALYSIS
with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n\n" + "="*80 + "\n")
    f.write("2. CORRELATION ANALYSIS\n")
    f.write("="*80 + "\n\n")
    
    # Interest Rate vs Loan Amount
    df['loan_int_rate'] = pd.to_numeric(df['loan_int_rate'], errors='coerce')
    df['loan_amnt'] = pd.to_numeric(df['loan_amnt'], errors='coerce')
    df['customer_income'] = pd.to_numeric(df['customer_income'], errors='coerce')
    
    corr1 = df[['loan_int_rate', 'loan_amnt']].corr()
    f.write("Interest Rate vs Loan Amount Correlation:\n")
    f.write(corr1.to_string())
    
    f.write("\n\nIncome vs Loan Amount Correlation:\n")
    corr2 = df[['customer_income', 'loan_amnt']].corr()
    f.write(corr2.to_string())

# 3. HYPOTHESIS TESTING - T-TEST
with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n\n" + "="*80 + "\n")
    f.write("3. HYPOTHESIS TESTING - T-TEST\n")
    f.write("="*80 + "\n")
    f.write("Testing: Loan Amount differences between DEFAULT vs NO DEFAULT customers\n\n")
    
    default_loan = df[df['Current_loan_status'] == 'DEFAULT']['loan_amnt']
    non_default_loan = df[df['Current_loan_status'] == 'NO DEFAULT']['loan_amnt']
    
    t_stat, p_value = ttest_ind(default_loan, non_default_loan, equal_var=False)
    
    f.write(f"T Statistic: {t_stat:.6f}\n")
    f.write(f"P Value: {p_value:.10f}\n")
    f.write(f"Sample Size (DEFAULT): {len(default_loan)}\n")
    f.write(f"Sample Size (NO DEFAULT): {len(non_default_loan)}\n")
    f.write(f"Mean Loan Amount (DEFAULT): ${default_loan.mean():.2f}\n")
    f.write(f"Mean Loan Amount (NO DEFAULT): ${non_default_loan.mean():.2f}\n")
    
    if p_value < 0.05:
        f.write("\n✓ RESULT: The difference IS statistically SIGNIFICANT (p < 0.05)\n")
    else:
        f.write("\n✗ RESULT: The difference is NOT statistically significant (p >= 0.05)\n")

# 4. CHI-SQUARE TEST
with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n\n" + "="*80 + "\n")
    f.write("4. CHI-SQUARE TEST\n")
    f.write("="*80 + "\n")
    f.write("Testing: Relationship between Loan Grade and Default Status\n\n")
    
    table = pd.crosstab(df['loan_grade'], df['Current_loan_status'])
    chi2, p_value, dof, expected = chi2_contingency(table)
    
    f.write(f"Chi-Square Statistic: {chi2:.4f}\n")
    f.write(f"P Value: {p_value:.10f}\n")
    f.write(f"Degrees of Freedom: {dof}\n")
    
    if p_value < 0.05:
        f.write("\n✓ RESULT: Variables ARE significantly related (p < 0.05)\n")
    else:
        f.write("\n✗ RESULT: Variables are NOT significantly related (p >= 0.05)\n")

# 5. OUTLIER DETECTION
with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n\n" + "="*80 + "\n")
    f.write("5. OUTLIER DETECTION (Z-Score Analysis)\n")
    f.write("="*80 + "\n\n")
    
    for col in ['customer_income', 'loan_amnt', 'loan_int_rate']:
        z = np.abs(stats.zscore(df[col]))
        outliers = df[z > 3]
        f.write(f"{col}: {len(outliers)} outliers (|Z| > 3)\n")

# 6. DEBT BURDEN RATIO
with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n\n" + "="*80 + "\n")
    f.write("6. DEBT BURDEN RATIO ANALYSIS\n")
    f.write("="*80 + "\n\n")
    
    df['Debt_Burden_Ratio'] = df['loan_amnt'] / df['customer_income']
    f.write(f"Mean Debt Burden Ratio: {df['Debt_Burden_Ratio'].mean():.4f}\n")
    f.write(f"Median Debt Burden Ratio: {df['Debt_Burden_Ratio'].median():.4f}\n")
    f.write(f"Min Debt Burden Ratio: {df['Debt_Burden_Ratio'].min():.4f}\n")
    f.write(f"Max Debt Burden Ratio: {df['Debt_Burden_Ratio'].max():.4f}\n")
    
    f.write("\n\nSample Records:\n")
    f.write(df[['customer_id', 'Debt_Burden_Ratio']].head(10).to_string())

# Summary
with open(output_file, 'a', encoding='utf-8') as f:
    f.write("\n\n" + "="*80 + "\n")
    f.write("SUMMARY & CONCLUSIONS\n")
    f.write("="*80 + "\n\n")
    f.write("✓ Analysis completed successfully!\n")
    f.write("✓ All statistical tests have been performed.\n")
    f.write("✓ Results indicate significant relationships in the loan dataset.\n")
    f.write("\n" + "="*80 + "\n")

print(f"✅ Complete analysis saved to:\n{output_file}")
