import packetTypes from '../constants/packet-types.constants.js';
import NotificationPacket from '../protobuf/classes/notification/notification.proto.js';
import { serialize } from '../utils/packet-serializer.utils.js';
import { gameRedis } from '../utils/redis.utils.js';
import ResponsePacket from '../protobuf/classes/response/response.proto.js';
import { gameSessionsManager as gsm } from '../sessions/game.session.js';
import { ErrorCodes, SuccessCodes } from '../utils/errors/errorCodes.js';

export const towerAttackRequestHandler = async (socket, uuid, packetType, payload, io) => {
  const { timestamp, userId, towerIndex, monsterIndex } = payload;

  towerAttackNotification(socket, towerIndex, monsterIndex);
};

const towerAttackNotification = (socket, towerIndex, monsterIndex) => {
  const game = gsm.getGame(socket.gameId);

  // 게임이 진행 중이 아닐 때 정보 갱신 방지
  if (!game.isPlaying()) {
    return;
  }

  const packetType = packetTypes.TOWER_ATTACK_NOTIFICATION;
  const notificationPacket = new NotificationPacket('적 타워가 적 몬스터 공격 메세지', { towerIndex, monsterIndex });

  const packet = serialize(packetType, notificationPacket);

  game.emitToOther(socket.uuid, 'event', packet);
};

export const purchaseTowerHandler = async (socket, token, packetType, payload, io) => {
  const game = gsm.getGame(socket.gameId);

  // 게임이 진행 중이 아닐 때 정보 갱신 방지
  if (!game.isPlaying()) {
    return;
  }

  const resPacketType = packetTypes.TOWER_PURCHASE_RESPONSE;
  const notificationPacketType = packetTypes.TOWER_PURCHASE_NOTIFICATION;
  const { x, y, userGold, userId, towerCost, index } = payload;
  const towerData = { x, y };
  // console.log(socket.uuid);
  const redisUserGold = await gameRedis.getGameData(socket.uuid);

  if (redisUserGold.user_gold !== userGold) {
    const failUserGoldPacket = new ResponsePacket(
      ErrorCodes.GAME_DATA_MISMATCH,
      '보유 골드수량이 서버와 일치하지 않습니다'
    );
    const encodeFailUserGoldPacket = serialize(resPacketType, failUserGoldPacket);
    socket.emit('event', encodeFailUserGoldPacket);
    return;
  }

  if (towerCost > userGold) {
    const failPurchaseTowerPacket = new ResponsePacket(ErrorCodes.REQUEST_NOT_SUCCESS, '골드가 부족합니다');
    const encodeFailPurchaseTowerPacket = serialize(resPacketType, failPurchaseTowerPacket);
    socket.emit('event', encodeFailPurchaseTowerPacket);
    return;
  }

  let newUserGold = userGold - towerCost;

  await gameRedis.patchGameDataGold(socket.uuid, -towerCost);

  await gameRedis.patchGameDataTower(socket.uuid, towerData, index);
  // console.log(`${userId}님 타워 추가`);
  // console.log(towers);
  //응답 패킷 인코딩
  const resPacket = new ResponsePacket(SuccessCodes.SUCCESS, '타워 구입 성공', { newUserGold, x, y, index });
  //통지 패킷 인코딩
  const notificationPacket = new NotificationPacket('적 타워 추가!', { x, y, index });

  const encodeResPacket = serialize(resPacketType, resPacket);
  const encodeNotificationPacket = serialize(notificationPacketType, notificationPacket);
  socket.emit('event', encodeResPacket); //패킷응답

  game.emitToOther(socket.uuid, 'event', encodeNotificationPacket); //패킷통지
};
