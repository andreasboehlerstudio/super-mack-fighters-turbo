/** Native-resolution, transparent pixel frames; never enlarge individual effects. */
export const JAN_FX_SIZE = 192;
export const JAN_FX_FRAMES = 8;
export type JanEffect = 'slash' | 'quake' | 'impact';

export function janEffectPixels(kind: JanEffect, frame: number, green: boolean) {
  const size = JAN_FX_SIZE, pixels = new Uint8ClampedArray(size * size * 4);
  const palette = green ? [0x28613c, 0x65bc48, 0xb9ee76, 0xf4ffd1] : [0x805138, 0xd58b43, 0xffd579, 0xfff4cc];
  const phase = Math.max(0, Math.min(7, frame)) / 7;
  for (let y = 1; y < size - 1; y++) for (let x = 1; x < size - 1; x++) {
    const dx = x - 96, dy = y - 96;
    let shade = -1;
    if (kind === 'slash') {
      // A swept crescent with a pointed leading edge and a hollow centre.
      const radius = 45 + phase * 30, distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx), centre = -.9 + phase * 1.7;
      const sweep = Math.abs(angle - centre), thickness = Math.max(0, 17 * (1 - sweep / 1.15));
      const edge = radius - distance;
      if (sweep < 1.15 && edge >= 0 && edge < thickness)
        shade = edge < 2 ? 0 : edge < thickness * .4 ? 3 : edge < thickness * .72 ? 2 : 1;
      // Two detached streaks instead of a enclosing frame.
      for (let n = 0; n < 2; n++) {
        const sy = -24 + n * 43 + Math.round(phase * 9);
        if (dx > -70 + phase * 26 && dx < -12 + phase * 14 && Math.abs(dy - sy) < 2) shade = 1 + n;
      }
    } else if (kind === 'quake') {
      // Rising, tapered stone splinters; the baseline sits at y=160.
      for (let n = 0; n < 7; n++) {
        const cx = 28 + n * 22 + Math.round(phase * (n - 3) * 3);
        const lift = Math.sin(phase * Math.PI) * (17 + n % 3 * 9);
        const bottom = 160 - lift, height = (18 + n % 3 * 13) * (1 - phase * .45);
        const rise = bottom - y, width = 8 * (1 - rise / height);
        if (rise >= 0 && rise < height && Math.abs(x - cx) < width)
          shade = x < cx - 2 ? 0 : x < cx + 1 ? 2 : 1;
      }
      const ring = Math.abs(Math.hypot(dx / (34 + phase * 52), (y - 159) / (5 + phase * 8)) - 1);
      if (ring < .12 && y <= 160) shade = 2;
    } else {
      // Irregular impact rays, with a small bright core that breaks apart.
      const radius = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
      const rays = Math.pow(Math.max(0, Math.cos(angle * 7 + .45)), 12);
      const reach = 13 + Math.sin(phase * Math.PI) * 14 + rays * (49 + phase * 21);
      const hole = phase > .4 ? (phase - .4) * 55 : 0;
      if (radius < reach && radius > hole)
        shade = radius < 15 ? 3 : radius < reach * .6 ? 2 : radius < reach - 2 ? 1 : 0;
    }
    if (shade >= 0) {
      const color = palette[shade], offset = (y * size + x) * 4;
      pixels[offset] = color >> 16; pixels[offset + 1] = color >> 8 & 255;
      pixels[offset + 2] = color & 255; pixels[offset + 3] = 255;
    }
  }
  return pixels;
}
