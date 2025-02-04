import packetTypes from '../constants/packet-types.constants.js';
import loadGame from './game-loader.init.js';
import init from './init.js';
import Socket from '../socket.js';
import { toggleCssClass } from '../utils/toggler.utils.js';
import { addMessage } from '../chatting.js';
import { hideModal } from '../modals/modal.js';

init();

const initIndex = () => {
  document.getElementById('registerButton').addEventListener('click', () => {
    toggleCssClass('hide', 'register-buttons-01', 'main-buttons-01');
  });

  document.getElementById('loginButton').addEventListener('click', () => {
    toggleCssClass('hide', 'login-buttons-01', 'main-buttons-01');
  });

  document.getElementById('matchButton').addEventListener('click', () => {
    document.querySelector('.button-container').style.display = 'none';
    document.getElementById('progressBarContainer').style.display = 'block';

    loadGame(1);
  });

  document.getElementById('login').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // 로그인 패킷 송신
    Socket.sendEventProto(packetTypes.SIGN_IN_REQUEST, { id: `${username}`, password: `${password}` });
  });

  document.getElementById('login-back').addEventListener('click', () => {
    toggleCssClass('hide', 'login-buttons-01', 'main-buttons-01');
  });

  document.getElementById('register').addEventListener('click', () => {
    const username = document.getElementById('rusername').value;
    const password = document.getElementById('rpassword').value;
    // 회원 가입 패킷 송신
    Socket.sendEventProto(packetTypes.SIGN_UP_REQUEST, { id: `${username}`, password: `${password}` });
  });

  document.getElementById('register-back').addEventListener('click', () => {
    toggleCssClass('hide', 'register-buttons-01', 'main-buttons-01');
  });

  const inputField = document.querySelector('.chat-input input');
  document.getElementById('chat').addEventListener('click', () => {
    const messageText = inputField.value.trim();
    if (messageText) {
      addMessage(messageText, 'user');
      const payload = {
        chat: messageText,
      };
      Socket.sendEventProto(packetTypes.CHATTING_REQUEST, payload);
      inputField.value = '';
    }
  });

  document.getElementById('modalCloseButton').addEventListener('click', hideModal);
};

initIndex();
