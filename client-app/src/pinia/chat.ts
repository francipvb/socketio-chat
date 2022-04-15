import { defineStore } from "pinia";
import { useConnections } from "./connection";
import { useMessages } from "./messages";
import { socket } from "./socket";

export const useChatStore = defineStore("chat", {
  actions: {
    setup() {
      const connection = useConnections();
      const messages = useMessages();
      connection.initialize();
      messages.initialize();
      connection.connect();
    },
  },
  getters: {
    isConnected(): boolean {
      return useConnections().connected;
    },
    isReady(): boolean {
      const connections = useConnections();
      const messages = useMessages();
      return connections.initialized && messages.initialized && connections.connected;
    },
  },
});
