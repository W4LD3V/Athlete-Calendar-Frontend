export default function useDateFormat() {

    const formatDate = (timestampStart, timestampEnd) => {
        const startObj = new Date(timestampStart * 1000);
        const endObj = new Date(timestampEnd * 1000);

        const formatDate = (dateObj) => {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const formatTime = (dateObj) => {
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        const getWeekday = (dateObj) => {
            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return weekdays[dateObj.getDay()];
        }
        
        return `${formatDate(startObj)} (${getWeekday(startObj)}) | ${formatTime(startObj)} - ${formatTime(endObj)}`;
    }

    return {
        formatDate
    }
}
