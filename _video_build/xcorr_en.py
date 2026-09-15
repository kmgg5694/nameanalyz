# -*- coding: utf-8 -*-
import struct
import wave
from pathlib import Path

WORK = Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\work\en_compare")

def samples(path):
    with wave.open(str(path), "rb") as w:
        raw = w.readframes(w.getnframes())
        rate = w.getframerate()
    s = struct.unpack("<" + "h" * (len(raw) // 2), raw)
    return rate, s

rate, ref = samples(WORK / "ref.wav")
_, cur = samples(WORK / "cur.wav")

# downsample for speed: every 8 samples, first 6s of ref vs first 8s of cur
step = 8
ref_s = ref[: int(6 * rate) : step]
cur_s = cur[: int(8 * rate) : step]
# normalized cross correlation for lag 0..3.5s
max_lag = int(3.5 * rate / step)
best = (-1, 0)
ref_len = len(ref_s)
# energy
def energy(a):
    return sum(x * x for x in a) ** 0.5 or 1

er = energy(ref_s)
for lag in range(0, max_lag, max(1, int(0.01 * rate / step))):  # 10ms
    chunk = cur_s[lag: lag + ref_len]
    if len(chunk) < ref_len:
        break
    dot = sum(a * b for a, b in zip(ref_s, chunk))
    corr = dot / (er * energy(chunk))
    if corr > best[0]:
        best = (corr, lag * step / rate)

print("best corr", round(best[0], 4), "offset_sec", round(best[1], 3))
print("dur_ref", len(ref)/rate, "dur_cur", len(cur)/rate, "diff", len(cur)/rate - len(ref)/rate)
