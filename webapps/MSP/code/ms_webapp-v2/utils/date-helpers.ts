import dayjs from "dayjs";

/**
 * Validate historical date ranges to ensure
 * 1. start date is not after end date
 * 2. neither start date or end date is in the future
 */
export const validateDateRange = (history: {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
}): {
  isValid: boolean;
  errorMessage: string;
} => {
  const { startMonth, startYear, endMonth, endYear } = history;

  let errorMessage = "";

  const startDate = dayjs(`${startYear}-${startMonth}`, "YYYY-M").toDate();
  const endDate = dayjs(`${endYear}-${endMonth}`, "YYYY-M").toDate();

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1; // switch from 0-based to 1-based
  // neither start date or end date can be in the future
  const dateMaximum = dayjs(
    `${currentYear}-${currentMonth}`,
    "YYYY-M"
  ).toDate();

  if (startDate > dateMaximum) {
    errorMessage = "Start date cannot be in the future";
  } else if (endDate > dateMaximum) {
    errorMessage = "End date cannot be in the future";
  } else if (endDate < startDate) {
    errorMessage = "Start date cannot be after end date";
  }

  return {
    isValid: !errorMessage,
    errorMessage,
  };
};

/**
 * Convert year and month to ISO string
 * @param {string} year - e.g. "2022"
 * @param {string} month - "1", "2", "3", ... , or "12"
 * @returns {string | null} date string in ISO format, or null
 */
export const convertYearAndMonthToISO = (
  year?: string,
  month?: string
): string | null => {
  if (!year || !month) {
    return null;
  }

  return dayjs(`${year}-${month}`, "YYYY-M").toISOString();
};

export const getDurations = () => {
  return [
    "Choose a Duration",
    "15 Minute",
    "30 Minute",
    "45 Minute",
    "1 Hour",
    "1.5 Hour",
    "2 Hour",
    "3 Hour",
    "4 Hour",
  ];
};

export const getTimeSlots = () => {
  const timeSlots: string[] = [];
  timeSlots.push("Choose a Time");
  let hours, minutes, ampm;
  for (let i = 0; i <= 1430; i += 30) {
    hours = Math.floor(i / 60);
    minutes = i % 60;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    ampm = hours % 24 < 12 ? "am" : "pm";
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }
    timeSlots.push(hours + ":" + minutes + " " + ampm);
  }
  return timeSlots;
};
