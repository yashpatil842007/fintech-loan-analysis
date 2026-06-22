import pandas as pd
import numpy as np

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


#continous probability distribution
from scipy.stats import norm
import matplotlib.pyplot as plt

mean_income = df['customer_income'].mean()
std_income = df['customer_income'].std()

x = np.linspace(
    df['customer_income'].min(),
    df['customer_income'].max(),
    100
)

y = norm.pdf(
    x,
    mean_income,
    std_income
)

plt.figure(figsize=(8,5))
plt.plot(x,y)
plt.title("Income Normal Distribution")
plt.show()