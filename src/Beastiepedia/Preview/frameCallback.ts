import { BeastieAnimation, BeastieFrames } from "../../data/BeastieAnimations";

export type AnimationState = {
  request: number; // requestAnimationFrame
  frame?: number;
  anim?: BeastieAnimation;
  state?: BeastieFrames;
  frameTime: number;
  frameLength?: number;
  prevTime: number;
  userSpeed: number;
};

function updateHold(animState: AnimationState, beastieSpeed: number) {
  if (!animState.anim || !animState.state || animState.frame === undefined) {
    return;
  }
  const animSpeed = animState.anim.speed ?? 1;
  let hold = 2;
  const holds = animState.state.holds?.[animState.frame];
  if (holds) {
    if (typeof holds == "number") {
      hold = holds;
    } else if (Array.isArray(holds)) {
      hold = holds[Math.floor(Math.random() * holds.length)];
    }
  }
  animState.frameLength = (1000 / (24 * beastieSpeed * animSpeed)) * hold;
}

export function setupFrameCallback(
  setFrame: (frame: number) => void,
  animStateRef: React.RefObject<AnimationState>,
  beastieSpeed: number,
) {
  animStateRef.current.frameTime = 0;
  animStateRef.current.prevTime = 0;
  const frameCallback = (time: DOMHighResTimeStamp) => {
    const animState = animStateRef.current;
    if (animState.prevTime == 0) {
      animState.prevTime = time;
    }
    if (!animState.anim) {
      return;
    }
    if (!animState.state) {
      animState.state = Array.isArray(animState.anim.frames)
        ? animState.anim.frames[0]
        : animState.anim.frames;
      animState.frame = animState.state.startFrame ?? 0;
    }

    const startFrame = animState.state.startFrame ?? 0;
    const endFrame = animState.state.endFrame ?? startFrame;
    if (startFrame == endFrame && !Array.isArray(animState.anim.frames)) {
      setFrame(startFrame);
      return;
    }
    const reverse = startFrame > endFrame;

    if (
      animState.frame == undefined ||
      (reverse ? animState.frame > startFrame : animState.frame < startFrame)
    ) {
      setFrame(startFrame);
      animState.frame = startFrame;
    }

    animState.frameTime += time - animState.prevTime;
    if (animState.frameLength == undefined) {
      updateHold(animState, beastieSpeed);
    } else if (
      animState.frameTime >
      animState.frameLength / animState.userSpeed
    ) {
      animState.frameTime =
        animState.frameTime %
        (animState.frameLength / animState.userSpeed || 1);
      animState.frame += reverse ? -1 : 1;
      if (reverse ? animState.frame < endFrame : animState.frame > endFrame) {
        const transitions = animState.state.transitions;
        if (transitions && Array.isArray(animState.anim.frames)) {
          animState.state =
            animState.anim.frames[
              transitions[Math.floor(Math.random() * transitions.length)]
            ];
          animState.frame = animState.state.startFrame ?? 0;
        } else {
          if (animState.anim.loop) {
            return;
          }
          animState.frame = startFrame;
        }
      }
      setFrame(animState.frame);
      updateHold(animState, beastieSpeed);
    }

    animState.prevTime = time;
    animState.request = requestAnimationFrame(frameCallback);
  };

  animStateRef.current.request = requestAnimationFrame(frameCallback);
  return () => cancelAnimationFrame(animStateRef.current.request);
}
