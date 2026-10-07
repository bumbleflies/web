# bumble:live host runbook

You are the production host. Your laptop owns the YouTube stream. Nico, Sebi, and Chris are remote contributors over VDO.Ninja. This runbook is tailored to Linux, 1080p30, x264 software encoding (the host box is Intel-only).

## 0. What you need

Host machine: modern Linux laptop or desktop, wired Ethernet if available, 1080p webcam, headset or good microphone. A second monitor helps a lot.

Everyone: Chrome or Firefox, headphones or headset (mandatory, no laptop speakers), decent light on the face.

Install: OBS Studio 30 or newer. Guests install nothing.

## 1. YouTube event

The channel owner opens YouTube Studio, Create, Go Live. For rehearsal set Visibility to Unlisted.

Flow:

```text
YouTube Studio gives Stream URL plus Stream Key
  into OBS Settings > Stream (Service: YouTube)
    into YouTube over RTMP
```

Treat the stream key like a password. Do not paste it into chat, issues, or shared docs.

## 2. VDO.Ninja room

Create a room with a random suffix and a password. Example: `bumble-live-7f42`.

Run:

```bash
./tools/generate-links.sh bumble-live-7f42 "YOUR-ROOM-PASSWORD"
```

It prints:

* 1 director link (you only)
* 3 guest links with fixed push IDs: `NicoCam`, `SebiCam`, `ChrisCam`
* 3 OBS view links with solo mode for clean isolated feeds

Why fixed push IDs: the OBS view link watches a stream ID. If the guest publishes with the same ID every time (`&push=NicoCam`), your OBS source keeps working after refresh. This is the documented permanent link pattern.

Send each guest link privately. Keep the director link and the password to yourself.

Guest join steps: open link, allow camera and microphone, pick the right devices, put headphones on, join.

## 3. OBS setup

Profile `Bumbleflies YouTube`:

```text
Service: YouTube (RTMP, connect account or paste key)
Base canvas: 1920x1080, Output: 1920x1080, FPS: 30 common
Output: Advanced, Encoder: x264, Rate control: CBR
Bitrate: 8000 Kbps, Keyframe interval: 2 s, CPU preset: veryfast, Profile: high
Audio: 160 Kbps, 48 kHz, stereo
Recording: same encoder or x264 fallback, mkv or mp4
```

On a box with NVIDIA, you can switch the encoder to NVENC (preset P5, 9000 Kbps). That still works for 1080p30.

Scene collection `Bumbleflies Live` ships 7 scenes:

1. `01 Starting`: full screen branded overlay plus room tone
2. `02 Three`: Nico, Sebi, Chris side by side
3. `03 Conversation`: one large plus two small (duplicate per speaker as needed)
4. `04 Speaker`: one person full screen
5. `05 Screen plus People`: screen share large left, three small faces right
6. `06 Break`: branded pause card
7. `07 End`: branded outro card

Browser sources: `Nico`, `Sebi`, `Chris`, each 1920x1080, 30 fps, with `Shutdown source when not visible` on to save CPU. Overlays are local HTML files from `overlays/`, added as Browser Source with Local file checked.

Audio: in OBS, watch the meters while each person counts. Aim for consistent peaks around minus 12 dB, no red. Everyone on headphones, always. Laptop speakers cause the echo loop: mic into VDO.Ninja into OBS into YouTube into the other guest speaker into their mic.

## 4. Screen share

The presenter shares their screen through their VDO.Ninja guest link (Screenshare button). That creates a second feed. In OBS you add it as an extra browser source or it appears as a separate solo link in the director room. Switch to scene `05 Screen plus People` while presenting.

## 5. Rehearsal (do not skip)

T minus 60: everyone joins VDO.Ninja. Check camera, mic, headphones, light, background, network.

T minus 45: open OBS. Confirm Nico, Sebi, Chris video plus audio plus screen plus overlays.

T minus 30: start the encoder to YouTube, stay Unlisted. Check the YouTube preview in a browser, not just OBS.

T minus 20: run the full switch path: Starting, Three, Conversation, Speaker, Screen plus People, Break, Three, End.

T minus 10: stop everything. Ask: could we rebuild this tomorrow without remembering? If not, simplify.

## 6. Emergency plan

Guest video freezes or drops: cut to Speaker on a remaining person, keep talking. Reinvite after the segment.

Guest audio fails: mute that source in OBS immediately, continue with two people.

Guest audio echoes: confirm headphones. If it persists, mute and ask them to rejoin with headphones.

VDO.Ninja dies: host continues solo full screen and narrates. Restart the room after.

OBS dies: restart OBS, reconnect to YouTube. YouTube Live Control Room shows stream health. Keep that tab open during the show.

YouTube connection drops: OBS auto reconnects. Do not create a second event mid show unless YouTube tells you the event ended.

## 7. After the show

End the stream in YouTube Studio first, then Stop Streaming in OBS. Save the local recording. Copy the stream key out of any pasted location. Note one fix for next time at the top of CHECKLIST.md.
