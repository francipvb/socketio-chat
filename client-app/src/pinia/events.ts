export interface User {
  id: string;
  name?: string;
}

export interface Message {
  id: string;
  message: string;
  sentOn: Date;
  sender: string;
}

export interface ServerEvents {
  login(user: User): void;
  logout(id: string): void;
  update(user: User): void;
  message(msg: Message): void;
}

export interface ClientEvents {
  setName(name: string): void;
  message(msg: string): void;
}
