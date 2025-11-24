// src/api/endpoints.js
import { http, setAuthToken } from './client';

// --------------- AUTH ---------------

/** Anonymous login to get a player token (JWT or similar). */
export async function anonLogin() {
  const res = await http('POST', '/auth/anonymous');
  // expected: { token: "..." }
  setAuthToken(res.token);
  return res;
}

// --------------- GAME LIFECYCLE ---------------

/** Start a new game (level, animal, discipline) */
export async function startGame({ level, animal, discipline }) {
  // POST /games
  return http('POST', '/games', {
    body: { level, animal, discipline }
  });
}

/** Get current game state by id */
export async function getGame(gameId) {
  return http('GET', `/games/${encodeURIComponent(gameId)}`);
}

/** Roll two dice and advance */
export async function roll(gameId) {
  return http('POST', `/games/${encodeURIComponent(gameId)}/roll`);
}

/** Answer a quiz currently pending on the game state */
export async function answerQuiz(gameId, quizId, selected) {
  return http('POST', `/games/${encodeURIComponent(gameId)}/quiz/${quizId}/answer`, {
    body: { selected }
  });
}

/** Make a choice for an event (moral choice / scenario) */
export async function chooseEvent(gameId, eventId, choiceKey) {
  return http('POST', `/games/${encodeURIComponent(gameId)}/event/${eventId}/choice`, {
    body: { choiceKey }
  });
}

/** Reset the board (same level), or you can pass a different level to restart */
export async function resetGame(gameId, level) {
  return http('POST', `/games/${encodeURIComponent(gameId)}/reset`, {
    body: level != null ? { level } : undefined
  });
}

// --------------- LEADERBOARD ---------------

/** Submit a final score record */
export async function submitScore({ playerName, animal, discipline, score, reputation, knowledge, coins }) {
  return http('POST', '/leaderboard', {
    body: { playerName, animal, discipline, score, reputation, knowledge, coins }
  });
}

/** Get top N scores */
export async function topScores({ limit = 20 } = {}) {
  return http('GET', '/leaderboard', { params: { limit } });
}
