export default function generateSlug(text: string): string {
  return text
    .toLowerCase() // Chuyển thành chữ thường
    .trim() // Xóa khoảng trắng thừa
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu "-"
    .replace(/[^a-z0-9-]/g, ""); // Xóa ký tự đặc biệt
}
