function get() {
  const cookie = document.cookie.split(';').find((cookie) => cookie.includes('player-id'))

  return cookie?.split('=')[1] || null
}

function set(playerId) {
  document.cookie = `player-id=${playerId};path=/`
}

export default {
  get,
  set
}
