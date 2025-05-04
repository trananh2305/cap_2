# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

# Đọc dữ liệu đã tiền xử lý
data = pd.read_csv('preprocessed_data.csv')

if len(data) > 100:
    features = ['dishName', 'quantity', 'timeBetweenOrderAndStart', 'timeBetweenStartAndCompletion',
                'queueSizeAtOrder', 'availableChefsAtOrder', 'categoryName', 'difficultyLevel',
                'hourOfDay', 'dayOfWeek', 'isWeekend']
    X = data[features]
    y = data['actualTime']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=300, max_depth=20, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)

    print(f"Mean Absolute Error: {mae:.2f} minutes")

    joblib.dump(model, 'trained_model.pkl')
    print("Model trained and saved!")
else:
    print("Not enough data for training.")