import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi"); // Set global locale to French
dayjs.tz.setDefault("Asia/Ho_Chi_Minh"); // Set default timezone

export { dayjs };
