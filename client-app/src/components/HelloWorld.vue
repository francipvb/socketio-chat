<script setup lang="ts">
import { ref } from "vue";
import { useConnections, useMessages } from "../pinia";

defineProps<{ msg: string }>();

const count = ref(0);
const messages = useMessages();
const msg = ref("");
const connections = useConnections();
const send = () => {
  messages.sendMessage(msg.value);
  msg.value = "";
};
const name = ref("");
const changeName = () => {
  connections.setName(name.value);
};
</script>

<template>
  <div class="container">
    <div class="col-md-4">
      <h2>Users</h2>
      <label>Name: <input @input="changeName()" v-model="name" /></label>
      <ul v-if="connections.users.length > 0">
        <li v-for="user in connections.users">
          <p>{{ user.name ?? "No name" }}</p>
        </li>
      </ul>
      <p v-else>No users.</p>
    </div>
    <div class="col-md-6">
      <h2>Messages</h2>
      <ul v-if="messages.messageCount > 0">
        <li v-for="message in messages.messages">
          <p>
            {{ connections.entities[message.sender].name ?? "Anonymous" }}:
            {{ message.message }}
          </p>
        </li>
      </ul>
      <p v-else>No mesages yet.</p>
      <div>
        <input type="text" v-model="msg" />
        <button @click.prevent="send">send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
