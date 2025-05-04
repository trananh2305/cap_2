import { TableStatus } from "../enums/TableStatus";
import TableModel from "../models/TableModel";
import { getIo } from "../sockets/socket";

export const checkLongWaitingTables = async () => {
  const now = new Date();
  const thresholdMs = 3 * 60 * 1000; // 3 phút

  const tables = await TableModel.find({
    status: TableStatus.OCCUPIED,
    waitingTimeAt: { $lte: new Date(now.getTime() - thresholdMs) }
  }).select("_id tableNumber waitingTimeAt").lean();

  const io = getIo();

  for (const table of tables) {
    io.emit("table:long-waiting", {
      tableId: table._id.toString(),
      tableNumber: table.tableNumber,
      waitingSince: table.waitingTimeAt,
      message: `Bàn ${table.tableNumber} đã chờ hơn 3 phút!`
    });
    // console.log(`⚠️ Emit warning: Table ${table.tableNumber} waiting too long`);
  }
};
