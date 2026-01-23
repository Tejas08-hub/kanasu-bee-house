import numpy as np
from sklearn.linear_model import LogisticRegression

# 1. Training data (Temperature, Humidity)
X = np.array([
    [32, 60],
    [33, 65],
    [31, 58],
    [35, 70],
    [40, 55],
    [38, 85],
    [24, 65],
    [42, 90]
])

# 2. Labels (0 = Normal, 1 = Abnormal)
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])

# 3. Create and train model
model = LogisticRegression()
model.fit(X, y)

# 4. Test with new hive data
test_data = np.array([[34, 62]])
prediction = model.predict(test_data)

if prediction[0] == 0:
    print("Hive Condition: NORMAL 🟢")
else:
    print("Hive Condition: ABNORMAL 🔴")
