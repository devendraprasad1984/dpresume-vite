import range from "lodash/range";
import dayjs from "dayjs";

const currentYear = dayjs().year();

const calendarYears = range(currentYear - 100, currentYear + 1);

export default calendarYears;
