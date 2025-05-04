import mongoose from "mongoose";

async function getMenuItemsData(): Promise<any[]> {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Chưa kết nối đến MongoDB!");
        }

        const collectionName = "menuitems";

        // Kiểm tra nếu collection tồn tại
        if (!mongoose.connection.db) {
            throw new Error("Database connection not initialized");
        }
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === collectionName);

        if (!collectionExists) {
            throw new Error(`Collection '${collectionName}' không tồn tại trong MongoDB!`);
        }

        // Dùng lại model nếu đã có để tránh lỗi OverwriteModelError
        const Model = mongoose.models[collectionName] ??
            mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);

        const data = await Model.find({}).lean();
        return data;
    } catch (error: any) {
        console.error("❌ Lỗi lấy dữ liệu từ MongoDB:", error.message);
        return [];
    }
}

export default getMenuItemsData;
