/**
 * Formats time to show only hours and minutes (HH:MM format)
 * @param {string} timeString - Time string in format "HH:MM:SS" or "HH:MM"
 * @returns {string} Formatted time in "HH:MM" format
 */
export const formatTimeToHoursMinutes = (timeString) => {
    if (!timeString || timeString === "N/A" || timeString === "null") {
        return "N/A";
    }

    // If time is already in HH:MM format, return as is
    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
        return timeString;
    }

    // If time is in HH:MM:SS format, extract HH:MM
    if (timeString.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
        return timeString.substring(0, 5);
    }

    // If it's a Date object or timestamp, convert to HH:MM
    if (timeString instanceof Date) {
        return timeString.toTimeString().substring(0, 5);
    }

    // For any other format, try to extract time
    const timeMatch = timeString.toString().match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
    }

    return timeString; // Return original if no pattern matches
};

/**
 * Formats duration to show only hours and minutes
 * @param {string} durationString - Duration string in format "HH:MM:SS" or "HH:MM"
 * @returns {string} Formatted duration in "HH:MM" format
 */
export const formatDurationToHoursMinutes = (durationString) => {
    if (!durationString || durationString === "N/A" || durationString === "null") {
        return "N/A";
    }

    // If duration is already in HH:MM format, return as is
    if (durationString.match(/^\d{1,2}:\d{2}$/)) {
        return durationString;
    }

    // If duration is in HH:MM:SS format, extract HH:MM
    if (durationString.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
        return durationString.substring(0, 5);
    }

    return durationString; // Return original if no pattern matches
}; 