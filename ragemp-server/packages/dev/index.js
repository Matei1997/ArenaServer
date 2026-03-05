// packages/dev/index.js
// Simple sanity checks to see if clothing works at all.

mp.events.addCommand("freemode", (player) => {
  player.model = mp.joaat("mp_m_freemode_01");
  player.outputChatBox("~g~Set model to mp_m_freemode_01");
});

mp.events.addCommand("cloth", (player) => {
  // force freemode just in case
  player.model = mp.joaat("mp_m_freemode_01");

  // Top, torso, legs, shoes etc (random basic outfit)
  player.setClothes(11, 15, 0, 2); // tops
  player.setClothes(3,  15, 0, 2); // torso/arms
  player.setClothes(4,  14, 0, 2); // legs
  player.setClothes(6,  34, 0, 2); // shoes

  player.outputChatBox("~g~Applied test outfit.");
});