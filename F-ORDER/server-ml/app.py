# app.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import subprocess

app = Flask(__name__)

model = joblib.load('trained_model.pkl')
le_dish = joblib.load('label_encoder_dish_name.pkl')
le_category = joblib.load('label_encoder_dish_category.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = pd.DataFrame([data])

        df['orderTime'] = pd.to_datetime(df['orderTime'], errors='coerce')
        df['startCookingTime'] = pd.to_datetime(df.get('startCookingTime', df['orderTime']), errors='coerce')
        df['completionTime'] = pd.to_datetime(df.get('completionTime', df['startCookingTime']), errors='coerce')

        df['timeBetweenOrderAndStart'] = (df['startCookingTime'] - df['orderTime']).dt.total_seconds() / 60
        df['timeBetweenStartAndCompletion'] = (df['completionTime'] - df['startCookingTime']).dt.total_seconds() / 60

        df['hourOfDay'] = df['orderTime'].dt.hour
        df['dayOfWeek'] = df['orderTime'].dt.dayofweek
        df['isWeekend'] = (df['dayOfWeek'] >= 5).astype(int)

        df['dishName'] = df['dishName'].apply(lambda x: transform_label(le_dish, x))
        df['categoryName'] = df['categoryName'].apply(lambda x: transform_label(le_category, x))

        input_data = df[['dishName', 'quantity', 'timeBetweenOrderAndStart', 'timeBetweenStartAndCompletion',
                         'queueSizeAtOrder', 'availableChefsAtOrder', 'categoryName', 'difficultyLevel',
                         'hourOfDay', 'dayOfWeek', 'isWeekend']]

        average_time_per_dish = 7  # Giả định trung bình 7 phút một món

        # Thêm thời gian chờ nếu không có đầu bếp
        df['waitingTime'] = df.apply(lambda row: row['queueSizeAtOrder'] * average_time_per_dish if row['availableChefsAtOrder'] == 0 else 0, axis=1)

        predictions = model.predict(input_data)
        predictions += df['waitingTime']

        return jsonify({'predictedTime': predictions.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)}), 400


def transform_label(encoder, value):
    try:
        return encoder.transform([value])[0]
    except Exception:
        return -1


@app.route('/retrain', methods=['POST'])
def retrain():
    try:
        subprocess.run(['python', 'preprocess_data.py'], check=True)
        subprocess.run(['python', 'train_model.py'], check=True)
        return jsonify({"message": "Model retrained successfully."})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Retrain error: {e}"}), 400


if __name__ == '__main__':
    app.run(debug=True)