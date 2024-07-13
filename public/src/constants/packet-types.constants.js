import protoTypeNames from "./proto-type-names.constants.js";

const packetTypes = {
  SIGN_UP_REQUEST: 1,
  SIGN_UP_RESPONSE: 2,
  SIGN_IN_REQUEST: 3,
  SIGN_IN_RESPONSE: 4,

  STATE_SYNC: 5,

  MATCH_REQUEST: 6,
  MATCH_FOUND_NOTIFICATION: 7,

  TOWER_PURCHASE_REQUEST: 10,
  TOWER_PURCHASE_RESPONSE: 11,
  TOWER_PURCHASE_NOTIFICATION: 12,

  TOWER_ATTACK_REQUEST: 13,
  TOWER_ATTACK_RESPONSE: 14,
  TOWER_ATTACK_NOTIFICATION: 15,

  MONSTER_SPAWN_REQUEST: 20,
  MONSTER_SPAWN_RESPONSE: 21,
  MONSTER_SPAWN_NOTIFICATION: 22,
  MONSTER_KILL_REQUEST: 23,
  MONSTER_KILL_RESPONSE: 24,
  MONSTER_KILL_NOTIFICATION: 25,

  BASE_ATTACKED_REQUEST: 30,
  BASE_ATTACKED_RESPONSE: 31,
  GAME_OVER_NOTIFICATION: 32,
  GAME_END_REQUEST: 33,

  CHAT: 40,
};

const packetMessageTypeNames = Object.fromEntries(
  Object.entries(packetTypes).map(([key, value]) => {
    if (key.endsWith("RESPONSE")) {
      return [value, protoTypeNames.response.NAME];
    } else if (key.endsWith("REQUEST")) {
      return [value, protoTypeNames.request.NAME];
    }
    return [value, protoTypeNames.notification.NAME];
  }),
);

export const getMessageNameByPacketType = (packetType) => packetMessageTypeNames[packetType];

export default packetTypes;
