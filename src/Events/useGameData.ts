import { useState, useEffect } from "react";
import { NoData } from "./Types";

const EVENT_RESPONSE_EXPIRE = 12 * 60 * 60 * 1000;
function updateGameData<T>(
  path: string,
  setGameData: (gameData: T | NoData) => void,
) {
  fetch(`https://api.beastieballgame.com/api/${path}`)
    .then((res) => res.json())
    .then((data) => setGameData(data))
    .catch(() => setGameData(NoData.NoData));
}
export function useGameData<T>(
  path: string,
  storage: string,
  open: boolean,
): [NoData | T, () => void] {
  const [gameData, setGameData] = useState<NoData | T>(
    NoData.WaitingForResponse,
  );

  const handleSetGameData = (newGameData: NoData | T) => {
    setGameData(newGameData);
    localStorage.setItem(storage, JSON.stringify(newGameData));
    localStorage.setItem(storage + "Expire", String(Date.now()));
  };

  const forceReload = () => {
    if (gameData != NoData.WaitingForResponse) {
      updateGameData(path, handleSetGameData);
    }
  };

  useEffect(() => {
    const current = localStorage.getItem(storage);
    if (!current) {
      if (!open) {
        return;
      }
      return updateGameData(path, handleSetGameData);
    }
    let currentJson: T;
    try {
      currentJson = JSON.parse(current);
    } catch {
      if (!open) {
        return;
      }
      return updateGameData(path, handleSetGameData);
    }
    setGameData(currentJson);
    if (!open) {
      return;
    }
    const now = Date.now();
    const response_expire =
      Number(localStorage.getItem(storage + "Expire") ?? 0) +
      EVENT_RESPONSE_EXPIRE;
    if (response_expire < now) {
      updateGameData(path, handleSetGameData);
    }
  }, [open]);

  return [gameData, forceReload];
}
