import Phaser from 'phaser';
import {activeMove, type Actor, type Projectile} from './combat.ts';
import {JAN_FX_FRAMES, JAN_FX_SIZE, janEffectPixels, type JanEffect} from './jan-special-art.ts';

const key = (kind: JanEffect, green: boolean) => `jan-fx-${kind}-${green ? 'green' : 'gold'}`;

/** Cached sprite sheets at 1:1 combat pixels. Simulation ages also pause/slow the effects. */
export class JanSpecialSprites {
  private strikes: Phaser.GameObjects.Sprite[] = [];
  private shots = new Map<number, Phaser.GameObjects.Sprite>();
  constructor(private scene: Phaser.Scene) {
    for (const green of [false, true]) for (const kind of ['slash', 'quake', 'impact'] as const) {
      const name = key(kind, green);
      if (scene.textures.exists(name)) continue;
      const canvas = document.createElement('canvas');
      canvas.width = JAN_FX_SIZE * JAN_FX_FRAMES; canvas.height = JAN_FX_SIZE;
      const ctx = canvas.getContext('2d')!;
      for (let frame = 0; frame < JAN_FX_FRAMES; frame++) {
        const image = ctx.createImageData(JAN_FX_SIZE, JAN_FX_SIZE);
        image.data.set(janEffectPixels(kind, frame, green));
        ctx.putImageData(image, frame * JAN_FX_SIZE, 0);
      }
      const texture = scene.textures.addCanvas(name, canvas)!;
      for (let frame = 0; frame < JAN_FX_FRAMES; frame++)
        texture.add(frame, 0, frame * JAN_FX_SIZE, 0, JAN_FX_SIZE, JAN_FX_SIZE);
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    this.strikes = [0, 1].map(() => scene.add.sprite(0, 0, key('slash', false), 0).setDepth(3).setVisible(false));
  }
  draw(actors: Actor[], projectiles: Projectile[], ground: number) {
    actors.forEach((a, index) => {
      const sprite = this.strikes[index]; sprite.setVisible(false);
      if (a.id !== 'jan' || a.transformTicks > 0 || !['special', 'ultra'].includes(a.action)) return;
      const move = activeMove(a), start = a.action === 'ultra' ? 28 : move.startup;
      const age = a.age - start;
      if (age < -4 || age >= 24) return;
      const kind: JanEffect = a.action === 'ultra' || move.kind === 'burst' ? 'impact' : move.kind === 'wave' ? 'quake' : 'slash';
      const frame = Math.min(7, Math.max(0, Math.floor(age / 3)));
      const y = kind === 'quake' ? ground + a.y - 64 : ground + a.y - 95;
      sprite.setTexture(key(kind, a.hulk), frame).setPosition(Math.round(a.x + a.face * (kind === 'impact' ? 96 : 64)), Math.round(y))
        .setFlipX(a.face < 0).setAlpha(age < 0 ? (age + 5) / 5 : age > 15 ? (24 - age) / 9 : 1).setVisible(true);
    });
    const live = new Set<number>();
    for (const p of projectiles) {
      if ((p.sourceId ?? actors[p.owner].id) !== 'jan') continue;
      live.add(p.id);
      const kind = p.kind === 'wave' ? 'quake' : 'slash';
      let sprite = this.shots.get(p.id);
      if (!sprite) { sprite = this.scene.add.sprite(0, 0, key(kind, !!p.finisher), 0).setDepth(3); this.shots.set(p.id, sprite); }
      // Quake artwork is drawn above its y=160 baseline; keep it grounded.
      sprite.setTexture(key(kind, !!p.finisher), Math.floor(p.age / 3) % JAN_FX_FRAMES)
        .setPosition(Math.round(p.x), Math.round(kind === 'quake' ? ground + p.y + 20 - 64 : ground + p.y))
        .setFlipX(p.vx < 0);
    }
    for (const [id, sprite] of this.shots) if (!live.has(id)) { sprite.destroy(); this.shots.delete(id); }
  }
}
