#!/usr/bin/env bash
# Builds VDO.Ninja guest links, director link, and OBS view links.
# Usage: ./generate-links.sh <room> <password>
# Example: ./generate-links.sh bumble-live-7f42 "correct-horse-9"
set -euo pipefail

ROOM="${1:-}"
PASS="${2:-}"

if [ -z "$ROOM" ] || [ -z "$PASS" ]; then
  echo "Usage: $0 <room> <password>" >&2
  exit 1
fi

enc() {
  python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$1"
}

ROOM_E=$(enc "$ROOM")
PASS_E=$(enc "$PASS")

echo "Room: $ROOM"
echo ""
echo "DIRECTOR (host only, keep private):"
echo "https://vdo.ninja/?director=${ROOM_E}&password=${PASS_E}&scenerestore"
echo ""
for NAME in Nico Sebi Chris; do
  PUSH="${NAME}Cam"
  echo "GUEST ${NAME} (send privately):"
  echo "https://vdo.ninja/?room=${ROOM_E}&password=${PASS_E}&push=${PUSH}&label=${NAME}"
  echo ""
  echo "OBS SOURCE ${NAME} (Browser Source, 1920x1080):"
  echo "https://vdo.ninja/?view=${PUSH}&solo&room=${ROOM_E}&password=${PASS_E}"
  echo ""
done
echo "SCREEN SHARE backup slot (guest opens a second tab to share screen):"
echo "https://vdo.ninja/?room=${ROOM_E}&password=${PASS_E}&push=ScreenShare&label=Screen"
echo ""
echo "OBS SOURCE Screen (Browser Source, 1920x1080):"
echo "https://vdo.ninja/?view=ScreenShare&solo&room=${ROOM_E}&password=${PASS_E}"
