function generateRoomCode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function handler(_, res) {
  const code = generateRoomCode(4);
  return res.status(200).json({
    roomCode: code,
  });
}
