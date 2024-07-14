import { getPayloadKeyNameByPacketType, packetNames } from '../constants/proto.constants.js';
import { toggleCssClass } from '../utils/toggler.utils.js';

const signInHandler = (socket, packetType, packet) => {
  console.log('signInHandler');
  // console.log(payload);
  // console.log(Object.keys(payload));
  // console.log(getPayloadKeyNameByPacketType(packetType));
  // console.log(payload[getPayloadKeyNameByPacketType(packetType)]);
  // console.log(Object.keys(payload[getPayloadKeyNameByPacketType(packetType)]));

  // div 토글
  toggleCssClass('hide', 'login-buttons-01', 'main-buttons-01');

  // 토큰 저장
  window.localStorage.setItem('token', packet.payload.token);
};

export default signInHandler;