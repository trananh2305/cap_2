interface formatDate {
  date: string;
}

const formatDate = (date: string): string => {
    // Chuyển chuỗi ngày thành đối tượng Date
    const formattedDate = new Date(date);
  
    // Lấy ngày, tháng, năm
    const day = formattedDate.getDate().toString().padStart(2, "0");
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = formattedDate.getFullYear();
  
    // Trả về ngày đã định dạng
    return `${day}/${month}/${year}`;
};

export default formatDate;
