<template>
    <div class="backdrop" @click.self="closeDeleteModal">
      <div class="modal">
        <p>Are you sure you want to delete this event: "{{ eventName }}"?</p>
        <button @click="confirmDeletion">Yes</button>
        <button @click="closeDeleteModal">No</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      eventName: String
    },
    emits: ['close', 'confirm'],
    methods: {
      closeDeleteModal() {
        this.$emit('close');
      },
      confirmDeletion() {
        this.$emit('confirm');
      }
    }
  }
  </script>
  