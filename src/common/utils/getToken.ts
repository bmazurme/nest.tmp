import { CHARACTERS } from '../constant';

export default function getToken() {
  let token = '';

  for (let i = 0; i < 25; i += 1) {
    token += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }

  return token;
}
