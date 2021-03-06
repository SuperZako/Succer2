﻿namespace MathHelper {
    export const EpsilonDouble = 1e-6;

    export const Pi = Math.PI;              // πの値を表します。
    export const PiOver2 = Math.PI / 2;     // πを 2 で割った値 (π/2) を表します。
    export const PiOver4 = Math.PI / 4;     // πを 4 で割った値 (π/4) を表します。
    export const TwoPi = Math.PI * 2;       // pi の 2 倍の値を表します。


    export function lerp(a: number, b: number, percent: number) {
        return a + (b - a) * percent;
    }

    export function randInRange(a: number, b: number) {
        return lerp(a, b, Math.random());
    }

    export function clamp(value: number, min: number, max: number) {
        if (min > max) {
            let temp = min;
            min = max;
            max = min;
        }

        return Math.min(Math.max(value, min), max);
    }
}