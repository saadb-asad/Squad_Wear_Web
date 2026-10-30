# Media Assets Optimization

#media-optimization #ffmpeg #pillow #performance

To ensure sub-second initial page loads and smooth hero video playback, all raw media assets undergo compression pipelines.

---

## 🎬 Hero Video Optimization (`Landing.mp4` → `hero.mp4`)

- **Root Cause & Black Frame Elimination**:
  - Raw video contained 9 pitch-black trailing frames at the end (`12.78s - 13.07s`).
  - Trimming black frames at `12.75s` and applying a **0.3s crossfade transition** eliminates loop stutter and black flashes.
- **1080p HD FFmpeg Command**:
  ```bash
  ffmpeg -y -i Landing.mp4 \
    -filter_complex "[0:v]split[v1][v2];[v1]trim=0:12.45,setpts=PTS-STARTPTS[main];[v2]trim=12.45:12.75,setpts=PTS-STARTPTS[tail];[0:v]trim=0:0.3,setpts=PTS-STARTPTS[head];[tail][head]xfade=transition=fade:duration=0.3:offset=0[fade];[main][fade]concat=n=2:v=1:a=0[outv]" \
    -map "[outv]" -c:v libx264 -crf 22 -preset medium -an -movflags +faststart \
    frontend/public/videos/hero.mp4
  ```

---

## 🖼 Image Optimization (Pillow Quantization)

- **PNG Quantization**: Large 24-bit product PNG photos (`SQD-HD-RED-350_front.png`, etc.) reduced from **~1.6 MB** down to **175–221 KB** each using Pillow palette quantization.
- **Total Payload Reduction**: Reduced overall site image payload by **> 77%**.

---

## 🔗 Related Notes
- [[Components Library]]
- [[React Frontend Architecture]]
- [[Development Setup & Operations]]
