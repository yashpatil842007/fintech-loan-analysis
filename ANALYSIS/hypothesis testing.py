import pandas as pd

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

    df[col] = pd.to_numeric(
        df[col],
        errors='coerce'
    )

df.dropna(inplace=True)

# T-test: Default vs Non-Default Income
# T-Statistic: Measures how different two groups are relative to the variation within groups
# Formula: (mean1 - mean2) / standard_error
# Higher absolute value = more different the groups are
# P-Value: Probability that the difference is due to random chance (0 to 1)
#   If p-value < 0.05, the difference is statistically significant

from scipy.stats import ttest_ind

try:
    print("Available columns:", df.columns.tolist())
    print("\nChecking loan status column...")
    
    # Find the correct loan status column name
    status_col = None
    for col in df.columns:
        if 'status' in col.lower() or 'loan_status' in col.lower():
            status_col = col
            print(f"Found status column: {status_col}")
            print(f"Unique values: {df[status_col].unique()}")
            break
    
    if status_col is None:
        print("ERROR: No loan status column found!")
        print("Available columns:", df.columns.tolist())
    else:
        default_loan = df[
            df[status_col] == 'DEFAULT'
        ]['loan_amnt']

        non_default_loan = df[
            df[status_col] == 'NO DEFAULT'
        ]['loan_amnt']

        if len(default_loan) == 0 or len(non_default_loan) == 0:
            print(f"ERROR: Not enough data. Default: {len(default_loan)}, No Default: {len(non_default_loan)}")
        else:
            t_stat, p_value = ttest_ind(
                default_loan,
                non_default_loan,
                equal_var=False
            )

            print("\n=== T-Test Results ===")
            print(f"T Statistic = {t_stat:.4f}")
            print(f"P Value = {p_value:.6f}")
            print("\nInterpretation:")
            print(f"- If p_value < 0.05: Difference is SIGNIFICANT")
            print(f"- If p_value >= 0.05: Difference is NOT significant")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

# Chi-Square Test: loan grade vs default
from scipy.stats import chi2_contingency

try:
    table = pd.crosstab(
        df['loan_grade'],
        df['Current_loan_status']
    )

    chi2, p_value, dof, expected = chi2_contingency(table)

    print("\n=== Chi-Square Test Results ===")
    print(f"Chi Square = {chi2:.4f}")
    print(f"P Value = {p_value:.6f}")
    print(f"Degrees of Freedom = {dof}")
    print("\nInterpretation:")
    print(f"- If p_value < 0.05: Variables are SIGNIFICANTLY related")
    print(f"- If p_value >= 0.05: Variables are NOT significantly related")

except Exception as e:
    print(f"ERROR in Chi-Square test: {e}")
    import traceback
    traceback.print_exc()
