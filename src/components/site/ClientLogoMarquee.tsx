"use client";

import { Pause, Play } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

function readMotion(viewport: HTMLDivElement) {
  const track = viewport.firstElementChild;
  const animation = track?.getAnimations()[0];
  const duration = animation?.effect?.getTiming().duration;
  const time = animation?.currentTime;
  const width = track?.firstElementChild?.getBoundingClientRect().width;

  return animation &&
    typeof duration === "number" &&
    typeof time === "number" &&
    duration > 0 &&
    width
    ? { animation, duration, time, width }
    : null;
}

function seekMotion(
  motion: NonNullable<ReturnType<typeof readMotion>>,
  time: number,
) {
  motion.animation.currentTime =
    ((time % motion.duration) + motion.duration) % motion.duration;
}

type DragGesture = {
  pointerId: number;
  startX: number;
  startY: number;
  scrollLeft: number;
  moving: boolean;
  motion: ReturnType<typeof readMotion>;
  playbackRate: number;
};

export default function ClientLogoMarquee({
  children,
  moreLink,
}: {
  children: ReactNode;
  moreLink: ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<DragGesture | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const images = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        for (const image of viewport.querySelectorAll("img")) {
          image.loading = "eager";
        }
        images.disconnect();
      },
      { rootMargin: "300px" },
    );
    images.observe(viewport);

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || gestureRef.current) return;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;
      if (!delta) return;
      const motion = readMotion(viewport!);
      if (!motion) return;

      event.preventDefault();
      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? viewport!.clientWidth
            : 1;
      seekMotion(
        motion,
        motion.time + (delta * unit * motion.duration) / motion.width,
      );
    }

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      images.disconnect();
      viewport.removeEventListener("wheel", onWheel);
      const gesture = gestureRef.current;
      if (gesture?.motion) {
        gesture.motion.animation.playbackRate = gesture.playbackRate;
      }
      gestureRef.current = null;
    };
  }, []);

  function finishGesture(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (gesture.motion) {
      gesture.motion.animation.playbackRate = gesture.playbackRate;
    }
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function startGesture(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || gestureRef.current) return;
    const viewport = event.currentTarget;
    const motion = readMotion(viewport);
    if (!motion && event.pointerType !== "mouse") return;

    const playbackRate = motion?.animation.playbackRate ?? 1;
    if (motion) motion.animation.playbackRate = 0;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      moving: false,
      motion,
      playbackRate,
    };
    viewport.setPointerCapture(event.pointerId);
  }

  function moveGesture(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (!gesture.moving) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 6) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        finishGesture(event);
        return;
      }
      gesture.moving = true;
      setDragging(true);
    }

    event.preventDefault();
    if (gesture.motion) {
      seekMotion(
        gesture.motion,
        gesture.motion.time -
          (deltaX * gesture.motion.duration) / gesture.motion.width,
      );
    } else {
      event.currentTarget.scrollLeft = gesture.scrollLeft - deltaX;
    }
  }

  return (
    <div
      className="client-marquee"
      data-paused={paused}
      data-dragging={dragging}
    >
      <div
        ref={viewportRef}
        className="client-marquee-viewport"
        role="region"
        aria-label="Логотипы компаний, для которых мы работали"
        tabIndex={0}
        onPointerDown={startGesture}
        onPointerMove={moveGesture}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
        onLostPointerCapture={finishGesture}
        onDragStart={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          const motion = readMotion(event.currentTarget);
          if (!motion) return;
          event.preventDefault();
          const distance = event.key === "ArrowRight" ? 204 : -204;
          seekMotion(
            motion,
            motion.time + (distance * motion.duration) / motion.width,
          );
        }}
      >
        <div className="client-logo-track">{children}</div>
      </div>
      <div className="client-marquee-actions">
        {moreLink}
        <button
          type="button"
          className="client-marquee-toggle"
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused
              ? "Продолжить движение логотипов"
              : "Приостановить движение логотипов"
          }
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          <span>{paused ? "Продолжить" : "Пауза"}</span>
        </button>
      </div>
    </div>
  );
}
