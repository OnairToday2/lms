import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/fr"; // Example: import French locale

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi"); // Set global locale to French
dayjs.tz.setDefault("/Ho_Chi_Minh"); // Set default timezone

export { dayjs };
