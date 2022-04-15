import { defineStore } from "pinia";
import { User } from "./events";
import { socket } from "./socket";

import login from "../assets/SOUNDS/login.wav";
import logout from "../assets/SOUNDS/logout.wav";
import { playLogin, playLogout } from "./sounds";

interface ConnectionUser extends User {
  disconnected: boolean;
}

export interface UserList {
  ids: string[];
  entities: Record<string, ConnectionUser>;
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
        playLogin();
      }
      this.entities[user.id] = { ...user, disconnected: false };
    },
    removeUser(id: string) {
      if (this.ids.includes(id)) {
        this.entities[id].disconnected = true;
        playLogout();
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
      return this.ids
        .map((id) => this.entities[id])
        .filter((u) => !u.disconnected);
    },
    usersCount(): number {
      return this.ids.length;
    },
  },
});
