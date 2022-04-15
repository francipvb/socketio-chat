import { defineStore } from "pinia";
import { User } from "./events";
import { socket } from "./socket";

export interface UserList {
  ids: string[];
  entities: Record<string, User>;
  connected: boolean;
  initialized: boolean;
}

function getInitialState(): UserList {
  return {
    entities: {},
    ids: [],
    connected: false,
    initialized: false,
  };
}

export const useConnections = defineStore("connections", {
  state: getInitialState,
  actions: {
    upsertUser(user: User) {
      if (!this.ids.includes(user.id)) {
        this.ids.push(user.id);
      }
      this.entities[user.id] = user;
    },
    removeUser(id: string) {
      if (this.ids.includes(id)) {
        this.ids = this.ids.filter((i) => i !== id);
        delete this.entities[id];
      }
    },
    initialize() {
      if (this.initialized) {
        return;
      }

      socket
        .on("connect", () => {
          this.connected = true;
        })
        .on("disconnect", (reason) => {
          this.connected = false;
        })
        .on("login", this.upsertUser)
        .on("update", this.upsertUser)
        .on("logout", this.removeUser);
      this.initialized = true;
    },
    connect() {
      socket.connect();
    },
    setName(name: string) {
      socket.emit("setName", name);
    },
  },
  getters: {
    users(): User[] {
      return this.ids.map((id) => this.entities[id]);
    },
    usersCount(): number {
      return this.ids.length;
    },
  },
});
