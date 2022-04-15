import joi from "joi";
import { defineStore } from "pinia";
import { useConnections } from "./connection";
import { Message } from "./events";
import { socket } from "./socket";

export interface MessageList {
  ids: string[];
  entities: Record<string, Message>;
  initialized: boolean;
}

const schema = joi.object<Message>({
  id: joi.string().label("Message ID").required(),
  message: joi.string().label("Message text").required(),
  sentOn: joi.date().iso(),
  sender: joi.string().label("Message sender"),
});

function getInitialState(): MessageList {
  return {
    ids: [],
    entities: {},
    initialized: false,
  };
}

export const useMessages = defineStore("messages", {
  state: getInitialState,
  actions: {
    initialize() {
      const connection = useConnections();
      if (this.initialized) {
        return;
      }
      connection.initialize();
      socket.on("message", this.addMessage);
      this.initialized = true;
    },
    addMessage(message: Message) {
      if (this.ids.includes(message.id)) {
        return;
      }
      const { error, value } = schema.validate(message);
      if (error) {
        console.trace(error);
        return;
      }
      if (!value) {
        console.log("No value.");
        return;
      }
      this.ids.push(value.id);
      this.entities[message.id] = message;
    },
    sendMessage(msg: string) {
      socket.emit("message", msg);
    },
  },
  getters: {
    messages(): Message[] {
      return this.ids
        .map((id) => this.entities[id])
        .sort((a, b) => a.sentOn.valueOf() - b.sentOn.valueOf());
    },
    messageCount(): number {
      return this.ids.length;
    },
  },
});
