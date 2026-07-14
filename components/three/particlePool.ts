import { PHASE_CODE, type ParticlePhase, type ParticleType, PARTICLE_TYPE } from "./particleTypes";

/**
 * Fixed-capacity particle pool, struct-of-arrays. Allocated once at engine
 * mount; recycling reassigns slots instead of creating/destroying objects
 * (ai/rules/coding.md #11, ai/rules/performance.md #2 — zero per-frame
 * allocation, object pooling in place).
 */
export class ParticlePool {
  readonly capacity: number;

  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly vx: Float32Array;
  readonly vy: Float32Array;
  readonly ax: Float32Array;
  readonly ay: Float32Array;
  readonly mass: Float32Array;
  readonly rotation: Float32Array;
  readonly angularVelocity: Float32Array;
  readonly life: Float32Array;
  readonly glow: Float32Array;
  readonly depth: Float32Array;
  readonly temperature: Float32Array;
  readonly noiseSeed: Float32Array;
  readonly targetX: Float32Array;
  readonly targetY: Float32Array;
  readonly energy: Float32Array;
  readonly type: Uint8Array;
  readonly phase: Uint8Array;
  readonly active: Uint8Array;
  /** Owning section id per slot, indexes into an external string table. */
  readonly ownerSlot: Int16Array;

  private freeList: number[] = [];

  constructor(capacity: number) {
    this.capacity = capacity;
    this.x = new Float32Array(capacity);
    this.y = new Float32Array(capacity);
    this.vx = new Float32Array(capacity);
    this.vy = new Float32Array(capacity);
    this.ax = new Float32Array(capacity);
    this.ay = new Float32Array(capacity);
    this.mass = new Float32Array(capacity);
    this.rotation = new Float32Array(capacity);
    this.angularVelocity = new Float32Array(capacity);
    this.life = new Float32Array(capacity);
    this.glow = new Float32Array(capacity);
    this.depth = new Float32Array(capacity);
    this.temperature = new Float32Array(capacity);
    this.noiseSeed = new Float32Array(capacity);
    this.targetX = new Float32Array(capacity);
    this.targetY = new Float32Array(capacity);
    this.energy = new Float32Array(capacity);
    this.type = new Uint8Array(capacity);
    this.phase = new Uint8Array(capacity);
    this.active = new Uint8Array(capacity);
    this.ownerSlot = new Int16Array(capacity).fill(-1);

    for (let i = capacity - 1; i >= 0; i--) this.freeList.push(i);
  }

  get activeCount(): number {
    return this.capacity - this.freeList.length;
  }

  /** Recycles a free slot (or returns null if pool is exhausted for this frame). */
  acquire(ownerSlot: number, type: ParticleType, phase: ParticlePhase): number | null {
    const i = this.freeList.pop();
    if (i === undefined) return null;
    this.active[i] = 1;
    this.ownerSlot[i] = ownerSlot;
    this.type[i] = PARTICLE_TYPE[type];
    this.phase[i] = PHASE_CODE[phase];
    this.mass[i] = 0.6 + Math.random() * 0.8;
    this.noiseSeed[i] = Math.random() * 1000;
    this.life[i] = 1;
    this.energy[i] = 0;
    this.rotation[i] = Math.random() * Math.PI * 2;
    this.angularVelocity[i] = (Math.random() - 0.5) * 0.02;
    return i;
  }

  /** Returns a slot to the free list — never nulled out via `delete`, just recycled. */
  release(i: number): void {
    this.active[i] = 0;
    this.ownerSlot[i] = -1;
    this.freeList.push(i);
  }

  /** Releases every slot owned by a given owner index (section left the scene). */
  releaseOwner(ownerSlot: number): void {
    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 1 && this.ownerSlot[i] === ownerSlot) this.release(i);
    }
  }
}
