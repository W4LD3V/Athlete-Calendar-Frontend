<template>
    <div class="backdrop" @click.self="closeDeleteModal()">
        <div class="modal">
            <p>Are you sure you want to save this event?</p>
            <slot name="eventTitle"></slot>
            <button @click.self="closeDeleteModal">Yes</button>
            <button @click.self="closeDeleteModal">No</button>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            closeDeleteModal(){
                this.$emit('close')
            }
        }
    }
</script>

<style>
  .modal {
    width: 400px;
    padding: 20px;
    margin: 200px auto;
    background: white;
    border-radius: 10px;
  }
  .backdrop {
    top: 0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
  }
</style>