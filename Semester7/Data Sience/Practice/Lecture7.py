import pandas as pd
import numpy as np

csv_file_path = r"C:\Users\ibo98\OneDrive\Desktop\Food_Delivery_Route_Efficiency_Dataset.csv"
df = pd.read_csv(csv_file_path)

try:
    df = pd.read_csv(csv_file_path)
    print("✅ DataFrame 'df' loaded successfully.")
except Exception as e:
    print(f"Error loading file: {e}")
    # If the file fails to load, we can't run the functions below.
    exit()

# --- 1. Descriptive Statistics (.describe()) ---
print("\n--- 1. Descriptive Statistics for Numeric Columns ---")
# This gives mean, standard deviation, min, max, and quartile ranges.
print(df.describe())


# --- 2. Check for Missing Values (.isnull().sum()) ---
print("\n--- 2. Count of Missing Values per Column ---")
# This is crucial for data cleaning.
print(df.isnull().sum())


# --- 3. Check Unique Values in a Sample Column (.unique()) ---
# Replace 'Delivery_Location_Type' with a column name from your actual dataset
# that you suspect is categorical (e.g., 'Weather_Condition', 'Vehicle_Type').
sample_column = 'Delivery_Location_Type' # **(Replace with actual column name)**

if sample_column in df.columns:
    print(f"\n--- 3. Unique Values in '{sample_column}' ---")
    # Shows all the unique categories present in that column.
    print(df[sample_column].unique())
else:
    print(f"\nColumn '{sample_column}' not found. Please adjust the script.")


# --- 4. Count of Each Value (.value_counts()) ---
if sample_column in df.columns:
    print(f"\n--- 4. Distribution (Value Counts) for '{sample_column}' ---")
    # Shows how many times each unique category appears.
    print(df[sample_column].value_counts())


# --- Example of a simple calculation (Mean Delivery Time) ---
# Assuming 'Delivery_Time_Minutes' is a numeric column in your dataset
try:
    if 'Delivery_Time_Minutes' in df.columns:
        average_time = df['Delivery_Time_Minutes'].mean()
        print(f"\n--- Example Calculation ---")
        print(f"The **Average Delivery Time** is: {average_time:.2f} minutes.")
except KeyError:
    print("\nCould not calculate average time. Check if 'Delivery_Time_Minutes' column exists.")



# second example

import pandas as pd
import numpy as np

# # --- Configuration ---
# # Using the raw string prefix (r"...") is CRITICAL for Windows paths.
# csv_file_path = r"C:\Users\ibo98\OneDrive\Desktop\Food_Delivery_Route_Efficiency_Dataset.csv"
# # --- End Configuration ---


# # --- Data Loading ---
# try:
#     df = pd.read_csv(csv_file_path)
#     print("="*60)
#     print("✅ DataFrame 'df' loaded successfully. Initial shape:", df.shape)
#     print("="*60)
# except Exception as e:
#     print(f"❌ Error loading file: {e}")
#     exit()


# # 1. INSPECTION AND CLEANING FUNCTIONS

# # 1a. Check for Missing Values (.isnull().sum())
# print("\n--- 1a. Missing Values Count Per Column ---")
# # Counts how many missing (NaN) values are in each column
# print(df.isnull().sum())


# # 1b. Data Type Conversion (.astype())
# print("\n--- 1b. Data Type Conversion Example ---")
# # Assuming 'Rating' is loaded as a float or object but should be an integer
# # The 'errors="ignore"' ensures the code doesn't crash if the column is missing or conversion fails.
# if 'Rating' in df.columns:
#     try:
#         df['Rating'] = df['Rating'].astype('int', errors='ignore')
#         print("Column 'Rating' converted to integer type.")
#     except Exception:
#         print("Could not convert 'Rating' to integer (might contain non-numeric data).")
# else:
#     print("Column 'Rating' not found to demonstrate astype().")


# # 1c. Dropping a Column (.drop(axis=1))
# # Create a new DataFrame without a hypothetical 'Notes' column
# if 'Notes' in df.columns:
#     df_dropped = df.drop(columns=['Notes'], axis=1)
#     print(f"\n--- 1c. Dropping a Column ('Notes') ---")
#     print("Original columns:", df.columns.tolist())
#     print("New columns:", df_dropped.columns.tolist())
# else:
#     # Use a common column if 'Notes' doesn't exist for demonstration
#     if len(df.columns) > 1:
#         col_to_drop = df.columns[0]
#         df_dropped = df.drop(columns=[col_to_drop])
#         print(f"\n--- 1c. Dropping the first column ('{col_to_drop}') ---")
#         print("New shape after drop:", df_dropped.shape)


# # 1d. Handling Missing Data (.fillna())
# # Fills any missing values in the 'Delivery_Fee' column with the mean fee
# if 'Delivery_Fee' in df.columns:
#     mean_fee = df['Delivery_Fee'].mean()
#     df['Delivery_Fee'] = df['Delivery_Fee'].fillna(mean_fee)
#     print(f"\n--- 1d. Filling Missing 'Delivery_Fee' ---")
#     print(f"Missing values filled with mean fee: {mean_fee:.2f}")


# # 1e. Replacing Values (.replace())
# # Standardizing text values for better consistency
# if 'Weather_Condition' in df.columns:
#     df['Weather_Condition'] = df['Weather_Condition'].replace({'Rainy': 'Rain', 'Stormy': 'Severe Weather'})
#     print("\n--- 1e. Replacing Values in 'Weather_Condition' ---")
#     print("After replacement, the unique values are:", df['Weather_Condition'].unique())


# # 2. AGGREGATION AND GROUPING FUNCTIONS

# # 2a. Grouping and Aggregating (.groupby() and .mean())
# if 'City' in df.columns and 'Delivery_Time' in df.columns:
#     print("\n--- 2a. Average Delivery Time by City ---")
#     # Groups rows by 'City' and calculates the mean of 'Delivery_Time' for each group
#     city_avg_time = df.groupby('City')['Delivery_Time'].mean().sort_values(ascending=False)
#     print(city_avg_time)
# else:
#     print("\nColumns 'City' or 'Delivery_Time' not found for grouping demo.")


# # 2b. Multiple Aggregations (.agg())
# if 'Vehicle_Type' in df.columns and 'Distance' in df.columns:
#     print("\n--- 2b. Multiple Aggregations (Min, Max, Mean Distance) by Vehicle Type ---")
#     # Applies multiple functions to the grouped data
#     vehicle_stats = df.groupby('Vehicle_Type')['Distance'].agg(['min', 'max', 'mean'])
#     print(vehicle_stats)
# else:
#     print("\nColumns 'Vehicle_Type' or 'Distance' not found for aggregation demo.")


# # 3. SELECTION AND FILTERING FUNCTIONS

# # 3a. Filtering with .loc[] (Selecting rows based on a condition)
# if 'City' in df.columns and 'Delivery_Time' in df.columns:
#     print("\n--- 3a. Filtering: Orders in 'New York' with Time > 40 minutes ---")
#     # Filters based on two conditions
#     filtered_df = df.loc[(df['City'] == 'New York') & (df['Delivery_Time'] > 40)]
#     print(filtered_df[['City', 'Delivery_Time', 'Distance']].head())
#     print(f"Total matching orders: {len(filtered_df)}")


# # 3b. Filtering with .query() (A cleaner way to filter)
# if 'Delivery_Fee' in df.columns:
#     print("\n--- 3b. Filtering with .query(): Low Fee Orders (Fee < 5) ---")
#     # Uses a SQL-like string expression for filtering
#     low_fee_orders = df.query('Delivery_Fee < 5')
#     print(f"Total low fee orders: {len(low_fee_orders)}")


# # 4. FEATURE ENGINEERING FUNCTIONS

# # 4a. Creating a new column using calculation
# if 'Distance' in df.columns and 'Delivery_Time' in df.columns:
#     # Calculates a new metric: Minutes per Kilometer
#     df['Time_Per_Km'] = df['Delivery_Time'] / df['Distance']
#     print("\n--- 4a. New Column: 'Time_Per_Km' (Delivery_Time / Distance) ---")
#     print(df[['Delivery_Time', 'Distance', 'Time_Per_Km']].head())
# else:
#     print("\nColumns 'Distance' or 'Delivery_Time' not found for calculation demo.")


# # 4b. Conditional creation with np.select (More advanced data bucketing)
# if 'Delivery_Time' in df.columns:
#     # Define conditions and corresponding choices
#     conditions = [
#         (df['Delivery_Time'] <= 20),
#         (df['Delivery_Time'] > 20) & (df['Delivery_Time'] <= 40),
#         (df['Delivery_Time'] > 40)
#     ]
#     choices = ['Fast', 'Moderate', 'Slow']
    
#     # Use numpy.select (often used with pandas) to create a new categorical column
#     df['Time_Bucket'] = np.select(conditions, choices, default='Unknown')
    
#     print("\n--- 4b. New Column: 'Time_Bucket' (Conditional creation) ---")
#     print("Distribution of new column:")
#     print(df['Time_Bucket'].value_counts())
# else:
#     print("\nColumn 'Delivery_Time' not found for Time_Bucket demo.")