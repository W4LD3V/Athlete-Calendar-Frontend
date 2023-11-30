<template>
    <form @submit.prevent="handleSubmit">
        <label>Location</label>
        <input type="text" v-model="location">
        <div class="radius-container">
            <label for="slider">Radius</label>
            <div class="slider-value">
                <input type="range" id="slider" name="slider" min="0" max="500" step="1" v-model="radius">
                <p>{{ radius }}km</p>
            </div>
        </div>
        <div class="date-container">
            <label>Start Date</label>
            <Datepicker v-model="startDate" :format="'YYYY-MM-DD'" @selected="handleDateChange" />
            <label>End Date</label>
            <Datepicker v-model="endDate" :format="'YYYY-MM-DD'" @selected="handleDateChange" />
        </div>
        <label>Activity Type</label>
        <select v-model="activityType">
                <option value="" selected></option>
                <option 
                v-for="activityType in activityTypes"
                :key="activityType"
                :value="activityType">
                    {{ activityType }}
                </option>
        </select>
        <label>Organizer</label>
        <select v-model="organizer">
            <option value="" selected></option>
            <option 
                v-for="organizer in organizersData"
                :key="organizer.id"
                :value="organizer.id">
                {{ organizer.name }}
            </option>
        </select>

        <input type="submit" value="Search">
    </form>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import { ref, watch } from 'vue';

export default {
    components: {
        Datepicker
    },
    props: ['eventData'],
    setup(props, { emit }) {
        const location = ref('');
        const date = ref('');
        const activityType = ref('');
        const organizer = ref('');
        const radius = ref(0);
        const organizers = ref([]);
        const organizersData = ref([]);
        const activityTypes = ref([]);
        const userCoordinates = ref(null);
        const startDate = ref(null);
        const endDate = ref(null);

        const filterEventOrganizers = () => {
            organizers.value = [...new Set(props.eventData.map(event => event.organizer))];
        };

        const filterEventTypes = () => {
            activityTypes.value = [...new Set(props.eventData.map(event => event.activitytype))];

        };

        const handleSubmit = async () => {
            await geocodeLocation();

            const formData = {
                userCoordinates: userCoordinates.value, 
                radius: radius.value
            };

            if (location.value) formData.location = location.value;
            if (startDate.value && endDate.value) formData.date = [Math.floor(startDate.value.getTime() / 1000), Math.floor(endDate.value.getTime() / 1000)];
            if (activityType.value) formData.activityType = activityType.value;
            if (organizer.value) formData.organizer = organizer.value;

            emitFormData(formData);
        };

        const emitFormData = (data) => {
            emit('form-data', data);
        };

        const geocodeLocation = async () => {
            if (!location.value) return;

            const apiKey = process.env.VUE_APP_GOOGLE_API_KEY;
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location.value}&key=${apiKey}`);
            const data = await response.json();
            if (data.results[0]) {
                userCoordinates.value = {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng
                };
            }
        };

        const handleDateChange = () => {
            if (startDate.value && endDate.value) {
                date.value = [Math.floor(startDate.value.getTime() / 1000), Math.floor(endDate.value.getTime() / 1000)];
            }
        };

        const fetchOrganizerNames = async () => {
            const uniqueOrganizerIds = [...new Set(props.eventData.map(event => event.organizer_id))];
            const organizersWithId = [];

            for (const id of uniqueOrganizerIds) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.VUE_APP_API_URL}/organizer/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch organizer name");
                    }

                    const data = await response.json();
                    organizersWithId.push({ name: data.name, id: id });
                } catch (error) {
                    console.error("Error fetching organizer name:", error);
                }
            }

            organizersData.value = organizersWithId;
        };



        watch(() => props.eventData, () => {
            filterEventOrganizers();
            filterEventTypes();
            fetchOrganizerNames();
        }, { immediate: true });

        return {
            location,
            date,
            activityType,
            organizer,
            radius,
            organizers,
            activityTypes,
            userCoordinates,
            startDate,
            endDate,
            organizersData,
            handleSubmit,
            handleDateChange
        };
    }
}
</script>


<style >
    form {
    max-width: 420px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 40px;
    border-radius: 10px;
    }
    label {
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    }
    input, select {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
    }
    .radius-container{
    display: block;
    }
    .date-container{
    display: block;
    }
    .slider-value {
    display: flex;
    align-items: center;
    }
    .slider-value p {
    margin-left: 10px;
    }
    select {
    background-color: #ecf0f1; 
    cursor: pointer;
    transition: background-color 0.3s ease;
    }
    select:hover {
        background-color: #e0e7e8;
    }

    input[type="range"] {
        -webkit-appearance: none;  
        background: #ecf0f1; 
        height: 5px;
        border-radius: 3px;
        outline: none;
        margin: 0;
        padding: 0;
        width: 100%;
        transition: background-color 0.3s ease; 
    }

    input[type="range"]:hover {
        background: #e0e7e8;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; 
        appearance: none;
        width: 16px;
        height: 16px;
        background: #2c3e50;
        border-radius: 50%; 
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #2c3e50;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="submit"] {
        background-color: #2c3e50;
        color: #ecf0f1;
        border: none; 
        padding: 10px 20px; 
        border-radius: 5px; 
        cursor: pointer;  
        transition: background-color 0.3s ease, transform 0.3s ease;
        margin-top: 20px;  
        font-weight: bold; 
    }

    input[type="submit"]:hover {
        background-color: #34495e;
    }

    input[type="submit"]:active {
        transform: scale(0.97); 
    }
</style>