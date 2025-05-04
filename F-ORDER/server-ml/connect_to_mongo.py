import pymongo

def connect_to_mongo():
    # Nếu sử dụng hardcoded URL, bỏ phần lấy từ môi trường
    # Ví dụ URL kết nối MongoDB Atlas
    database_url = "mongodb+srv://tranducminh3:123@food-order.epsc5.mongodb.net/"

    if not database_url:
        print("Lỗi: DATABASE_URI chưa được thiết lập.")
        return None

    print("Kết nối MongoDB với URL:", database_url)

    try:
        # Sử dụng kết nối MongoDB với URL đã cho
        client = pymongo.MongoClient(database_url)  
        db = client["test"]  # Cơ sở dữ liệu
        
        # Lấy các collection cần thiết
        aiTrainingDatas_collection = db["aitrainingdatas"]

        # Truy vấn dữ liệu
        aiTrainingDatas_data = list(aiTrainingDatas_collection.find())
        print("Kết nối thành công! Dữ liệu:", aiTrainingDatas_data)

        return aiTrainingDatas_data
    except Exception as e:
        print("Lỗi khi kết nối MongoDB:", e)
        return None

# Gọi hàm kết nối
connect_to_mongo()
