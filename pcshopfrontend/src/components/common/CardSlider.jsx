import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * CardSlider - A reusable horizontal card slider using native scroll-snap.
 *
 * Props:
 * - items: Array<any>
 * - renderItem: (item: any, index: number) => React.ReactNode
 * - autoPlay?: boolean (default true)
 * - interval?: number (ms, default 3000)
 * - pauseOnHover?: boolean (default true)
 * - ariaLabel?: string (for accessibility)
 * - className?: string (extra classes for outer container)
 * - itemClassName?: string (extra classes for each item wrapper)
 */
const CardSlider = ({
  items = [],
  renderItem,
  autoPlay = true,
  interval = 3000,
  pauseOnHover = true,
  ariaLabel = "Slider",
  className = "",
  itemClassName = "",
}) => {
  const scrollerRef = useRef(null);
  const timerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const canSlide = useMemo(() => (items?.length || 0) > 1, [items?.length]);

  const next = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = el.clientWidth; // scroll by viewport width
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const nextLeft = el.scrollLeft + step + 2; // small pad
    if (nextLeft >= maxScrollLeft) {
      // wrap to start
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  const prev = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = el.clientWidth;
    const prevLeft = el.scrollLeft - step - 2;
    if (prevLeft <= 0) {
      // wrap to end
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!autoPlay || !canSlide) return;
    if (pauseOnHover && isHovering) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      next();
    }, Math.max(1500, interval));
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [autoPlay, canSlide, interval, isHovering]);

  return (
    <div className={["relative", className].join(" ")}
      aria-label={ariaLabel}
      role="region"
      onMouseEnter={() => pauseOnHover && setIsHovering(true)}
      onMouseLeave={() => pauseOnHover && setIsHovering(false)}
    >
      {/* Controls */}
      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        disabled={!canSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={next}
        disabled={!canSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Track */}
      <div
        ref={scrollerRef}
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          // Hide scrollbar (Firefox done above; Chrome below)
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex gap-4 pr-6 [&::-webkit-scrollbar]:hidden">
          {items?.map((item, idx) => (
            <div
              key={item?.id ?? idx}
              className={[
                "snap-start shrink-0 w-1/2 sm:w-1/3 lg:w-1/5",
                itemClassName,
              ].join(" ")}
            >
              {renderItem ? renderItem(item, idx) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSlider;
