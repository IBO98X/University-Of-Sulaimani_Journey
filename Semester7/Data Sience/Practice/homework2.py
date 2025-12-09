import numpy as np
import matplotlib.pyplot as plt

# 1
print("Question [1]")
print("#############################################################")
consumption = np.array([350, 420, 390, 410, 460, 480, 500, 490, 470, 450, 430,
400])
total_consumption = np.sum(consumption)
print(f"Monthly Consumption (kWh): {consumption}")
print(f"Total Annual Consumption: {total_consumption} kWh")

print("#############################################################")

# 2
print("Question [2]")
print("#############################################################")

salaries = np.array([40, 42, 43, 45, 46, 47, 50, 52, 54, 55, 60, 65])
mean_salary = np.mean(salaries)
median_salary = np.median(salaries)
variance_salary = np.var(salaries)
std_dev_salary = np.std(salaries)
print(f"Salaries ($1,000s): {salaries}")
print(f"Mean: {mean_salary:.2f}")
print(f"Median: {median_salary:.2f}")
print(f"Variance: {variance_salary:.2f}")
print(f"Standard Deviation: {std_dev_salary:.2f}")

# 3
print("Question [3]")
print("#############################################################")

scores = np.array([80, 75, 90])
weights = np.array([0.2, 0.3, 0.5])
weighted_grade = np.average(scores, weights=weights)
print(f"Scores: {scores}")
print(f"Weights: {weights}")
print(f"Final Weighted Grade: {weighted_grade:.2f}")

# 4
print("Question [4]")
print("#############################################################")

temperatures = np.array([18, 20, 22, 21, 19, 23, 25])
min_temp = np.min(temperatures)
max_temp = np.max(temperatures)
temp_range = np.ptp(temperatures) 
print(f"Temperatures (°C): {temperatures}")
print(f"Minimum Temperature: {min_temp}°C")
print(f"Maximum Temperature: {max_temp}°C")

# 5
print("Question [5]")
print("#############################################################")

scores = np.array([45, 50, 55, 60, 65, 70, 75, 80, 85, 90])
p_25 = np.percentile(scores, 25)
p_50 = np.percentile(scores, 50) 
p_75 = np.percentile(scores, 75)
q_90 = np.quantile(scores, 0.9)
print(f"Scores: {scores}")
print(f"25th Percentile (Q1): {p_25}")
print(f"50th Percentile (Median/Q2): {p_50}")
print(f"75th Percentile (Q3): {p_75}")
print(f"0.9 Quantile (90th Percentile): {q_90}")

# 6
print("Question [6]")
print("#############################################################")

generated_weights = np.random.normal(70, 10, 200)
gen_mean = np.mean(generated_weights)
gen_std = np.std(generated_weights)
print(f"Generated Mean: {gen_mean:.2f} kg (Target was 70 kg)")
print(f"Generated Std Dev: {gen_std:.2f} kg (Target was 10 kg)")

# 7
print("Question [7]")
print("#############################################################")

np.random.seed(42) 
analyst1_samples = np.random.rand(5) 
np.random.seed(42) 
analyst2_samples = np.random.rand(5) 
print(f"Analyst 1's samples: {analyst1_samples}")
print(f"Analyst 2's samples: {analyst2_samples}")
are_identical = np.array_equal(analyst1_samples, analyst2_samples)
print(f"\nAre the results identical? {are_identical}")

# 8
print("Question [8]")
print("#############################################################")

spending = np.array([1000, 1500, 2000, 2500, 3000, 3500])
sales = np.array([20, 25, 28, 35, 40, 45])
cov_matrix = np.cov(spending, sales)
covariance = cov_matrix[0, 1] 
corr_matrix = np.corrcoef(spending, sales)
correlation = corr_matrix[0, 1] 
print(f"--- Covariance Matrix --- \n{cov_matrix}\n")
print(f"--- Correlation Matrix --- \n{corr_matrix}\n")
print(f"Covariance: {covariance:.2f}")
print(f"Correlation: {correlation:.2f}")

# 9
print("Question [9]")
print("#############################################################")

scores = np.random.randint(0, 101, 100)
counts, bin_edges = np.histogram(scores, bins=10)
print(f"Counts per bin: {counts}")
print(f"Bin edges: {bin_edges}")
plt.hist(scores, bins=10, edgecolor='black')
plt.title('Distribution of 100 Random Test Scores')
plt.xlabel('Score')
plt.ylabel('Number of Students')
plt.show()

# 10
print("Question [9]")
print("#############################################################")

ratings = np.array([5, 4, 3, 5, 4, 5, 2, 3, 4, 5, 1, 5, 4])
rating_counts = np.bincount(ratings)
most_frequent_rating = np.argmax(rating_counts[1:]) + 1
print(f"--- Rating Counts ---")
for i in range(1, len(rating_counts)):
    print(f"{i}-Star: {rating_counts[i]} times")
print(f"\nMost Frequent Rating: {most_frequent_rating} stars")

# 11
print("Question [11]")
print("#############################################################")

np.random.seed(99)
prices = np.random.randint(10, 100, 50)
print(f"Original Prices (first 10): {prices[:10]}...")
discount_indices = np.random.choice(range(len(prices)), 5, replace=False)
print(f"Indices chosen for discount: {discount_indices}")
discounted_prices = np.copy(prices).astype(float) # Use float for decimals
for index in discount_indices:
    discounted_prices[index] = discounted_prices[index] * 0.90
    print("\n--- Price Changes ---")
for index in discount_indices:
    print(f"Item at index {index}: Original Price ${prices[index]} -> New Price${discounted_prices[index]:.2f}")