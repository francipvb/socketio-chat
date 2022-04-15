import login from "../assets/sounds/login.wav";
import logout from "../assets/sounds/logout.wav";
import message from "../assets/sounds/message.wav";

function play(sound: string) {
  const audio = new Audio(sound);
  return audio.play().catch((err) => {});
}

export function playLogin() {
  play(login);
}

export function playLogout() {
  play(logout);
}

export function playMessage() {
  play(message);
}
