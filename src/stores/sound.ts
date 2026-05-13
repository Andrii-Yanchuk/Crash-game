let isSoundEnabled = false;

export function getIsSoundEnabled() {
  return isSoundEnabled;
}

export function toggleSoundEnabled() {
  isSoundEnabled = !isSoundEnabled;

  return isSoundEnabled;
}
