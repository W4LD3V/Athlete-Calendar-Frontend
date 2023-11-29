<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="previousMonth">Prev</button>
      
      <h1 class="white-title">{{ currentMonthName }} {{ currentYear }}</h1>
      <button @click="nextMonth">Next</button>
    </div>
    <div class="calendar-grid">
      <div class="day-name" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      <div class="day" v-for="day in daysInMonth" :key="day.date">
        <span :class="{ 'is-today': day.isToday, 'is-other-month': day.isOtherMonth }">{{ day.date.getDate() }}</span>
        <div class="events" v-for="event in day.events" :key="event.id">
          <div class="event-item">
            <router-link class="event-title" :to="{ name: 'EventDetails', params: { id: event.id } }">{{ event.title }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const savedEvents = ref([]);

const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentMonthName = computed(() => currentDate.value.toLocaleString('default', { month: 'long' }));

const fetchSavedEvents = async () => {
  try {
    const response = await fetch("http://localhost:3000/saved-events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.state.token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch saved events.");
    }

    const data = await response.json();
    savedEvents.value = data;
  } catch (error) {
    console.error("Error fetching saved events:", error);
  }
};

onMounted(fetchSavedEvents);

const daysInMonth = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1);
  const days = [];
  
  // Adjusting logic to make the week start from Monday
  let firstDayOfWeek = firstDayOfMonth.getDay();
  if (firstDayOfWeek === 0) { // Adjust for Sunday
      firstDayOfWeek = 7;
  }
  const daysFromPreviousMonth = firstDayOfWeek - 1;
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - daysFromPreviousMonth);

  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    const isToday = day.toDateString() === new Date().toDateString();
    const events = savedEvents.value.filter(event => 
      new Date(parseInt(event.date_start) * 1000).toDateString() === day.toDateString()
    );
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
  fetchSavedEvents();
});

const route = useRoute();

watch(() => route.path, () => {
  if (route.path === '/saved') {
    fetchSavedEvents();
  }
}, { immediate: true });

</script>

<style scoped>
.calendar {
  max-width: 700px;
  margin: 0 auto;
  
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.calendar-header button {
  background-color: #2c3e50;
  color: #ecf0f1;
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
  border: 1px solid #e74c3c;
  background-color: #ecf0f1;
  position: relative;
  padding: 5px
}

.is-other-month {
  background-color: #f9f9f9;
}

.events {
  margin-top: 5px;
}

.event-item {
  background-color: #e74c3c;
  color: #ecf0f1;
  padding: 3px;
  margin-top: 10px;
  margin-bottom: 2px;
  border-radius: 2px;
  font-size: 6px;
  cursor: pointer;
}

.event-item:hover {
  background-color: #2c3e50;
  color: white;
}

.event-item .event-title:visited {
  color: inherit; /* This will make visited links have the same color as normal links */
}

.event-item .event-title {
  text-decoration: none; /* This removes the underline */
}

button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #2c3e50;
  border: none;
  color: white;
  border-radius: 2px;
}

button:hover {
  background-color: #2c3e50;
}
</style>
