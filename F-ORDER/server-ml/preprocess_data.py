# preprocess_data.py
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from connect_to_mongo import connect_to_mongo

# Kết nối và lấy dữ liệu từ MongoDB
data = connect_to_mongo()

if data:
    df = pd.DataFrame(data)

    # Encode text features
    le_dish = LabelEncoder()
    le_category = LabelEncoder()

    df['dishName'] = le_dish.fit_transform(df['dishName'])
    df['categoryName'] = le_category.fit_transform(df['categoryName'])

    # Chuyển đổi thời gian
    df['orderTime'] = pd.to_datetime(df['orderTime'])
    df['startCookingTime'] = pd.to_datetime(df['startCookingTime'])
    df['completionTime'] = pd.to_datetime(df['completionTime'])

    # Tính toán thời gian giữa các sự kiện
    df['timeBetweenOrderAndStart'] = (df['startCookingTime'] - df['orderTime']).dt.total_seconds() / 60
    df['timeBetweenStartAndCompletion'] = (df['completionTime'] - df['startCookingTime']).dt.total_seconds() / 60

    # Tách thêm các đặc trưng thời gian
    df['hourOfDay'] = df['orderTime'].dt.hour
    df['dayOfWeek'] = df['orderTime'].dt.dayofweek
    df['isWeekend'] = (df['dayOfWeek'] >= 5).astype(int)

    # Loại bỏ những bản ghi bất thường
    df = df[(df['timeBetweenOrderAndStart'] >= 0) & (df['timeBetweenStartAndCompletion'] >= 0)]
    df = df[(df['timeBetweenStartAndCompletion'] < 180)]

    # Save encoders và data
    joblib.dump(le_dish, 'label_encoder_dish_name.pkl')
    joblib.dump(le_category, 'label_encoder_dish_category.pkl')
    df.to_csv('preprocessed_data.csv', index=False)

    print("Data preprocessed and saved!")
else:
    print("No data found.")