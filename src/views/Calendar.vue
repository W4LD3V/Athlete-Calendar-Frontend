<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="previousMonth">Prev</button>
      <span>{{ currentMonthName }} {{ currentYear }}</span>
      <button @click="nextMonth">Next</button>
    </div>
    <div class="calendar-grid">
      <div class="day-name" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      <div class="day" v-for="day in daysInMonth" :key="day.date">
        <span :class="{ 'is-today': day.isToday, 'is-other-month': day.isOtherMonth }">{{ day.date.getDate() }}</span>
        <div class="events" v-for="event in day.events" :key="event.id">
          <div class="event-item">
            <span>{{ event.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import useEventData from '@/composables/useEventData';

const { eventData, isLoading, error, fetchEventData } = useEventData();

const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentMonthName = computed(() => currentDate.value.toLocaleString('default', { month: 'long' }));

const daysInMonth = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1);

  // Adjust the index to make Monday the first day of the week
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  // Get the first day to display in the calendar, adjusting for the new start day
  const startDate = new Date(year, month, 1 - startDay);

  const days = [];
  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days = 42 days
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    const isToday = day.toDateString() === new Date().toDateString();
    const events = eventData.value.filter(event => {
      // Convert the event date from UNIX timestamp to Date and compare
      const eventDate = new Date(parseInt(event.date_start) * 1000);
      return eventDate.toDateString() === day.toDateString();
    });
    const isOtherMonth = day.getMonth() !== month;
    
    days.push({ date: day, isToday, events, isOtherMonth });
  }

  return days;
});


const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

watchEffect(() => {
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1);
  fetchEventData();
});
</script>

<style scoped>
.calendar {
  max-width: 700px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1px;
  background-color: #ddd;
}

.day-name {
  padding: 10px;
  background-color: #f5f5f5;
  text-align: center;
  font-weight: bold;
}

.day {
  background-color: #fff;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  position: relative;
}

.day:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.is-today {
  border: 1px solid blue;
  background-color: rgba(0, 0, 255, 0.1);
  position: relative;
}

.is-today::after {
  content: 'TODAY';
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 10px;
  color: blue;
}

.is-other-month {
  background-color: #f9f9f9;
}

.events {
  margin-top: 5px;
}

.event-item {
  background-color: #4285f4;
  color: white;
  padding: 3px;
  margin-bottom: 2px;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
}

.event-item:hover {
  background-color: #357ae8;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #4285f4;
  border: none;
  color: white;
  border-radius: 2px;
}

button:hover {
  background-color: #357ae8;
}
</style>
