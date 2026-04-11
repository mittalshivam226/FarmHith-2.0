'use client';
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;          // 0-5, supports decimals for display
  onChange?: (v: number) => void;  // if provided, becomes interactive
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
}

const sizePx = { sm: 14, md: 18, lg: 24 };

export function RatingStars({
  value,
  onChange,
  size = 'md',
  showValue = false,
  count,
}: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null);
  const px = sizePx[size];
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hover ?? value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(null)}
            className={`
              transition-transform
              ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
            `}
          >
            <Star
              size={px}
              className={filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          {value.toFixed(1)}{count !== undefined ? ` (${count})` : ''}
        </span>
      )}
    </div>
  );
}
