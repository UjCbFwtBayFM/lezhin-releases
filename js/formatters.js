export const formatters = {
  dateOrdinal(dateStr) {
    if (!dateStr) return '';

    let date;
    // Parse "YYYY-MM-DD" safely in local timezone
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${monthName} ${day}${getOrdinal(day)}`;
  }
};