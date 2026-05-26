import { Star, ShieldAlert, BadgeCheck, MessageSquare } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  key?: string;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-neutral-950/40 border border-neutral-850 rounded-xl p-5 hover:border-amber-500/30 transition duration-300 relative group flex flex-col justify-between h-full">
      {/* Decorative quotes icons on background */}
      <div className="absolute top-4 right-4 text-neutral-800/20 group-hover:text-amber-500/5 transition duration-300">
        <MessageSquare className="w-12 h-12" />
      </div>

      <div className="space-y-3 relative z-10">
        {/* Rating stars */}
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
          ))}
        </div>

        {/* Text */}
        <p className="text-sm text-neutral-300 leading-relaxed italic">
          "{testimonial.text}"
        </p>
      </div>

      {/* Author details */}
      <div className="flex items-center space-x-3 pt-5 border-t border-neutral-900 mt-4 relative z-10">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.author}
            className="w-10 h-10 rounded-full object-cover border border-neutral-800"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-800 text-amber-500 font-bold flex items-center justify-center text-sm border border-neutral-700">
            {testimonial.author.slice(0, 2).toUpperCase()}
          </div>
        )}
        
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-xs text-neutral-200">{testimonial.author}</span>
            <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-current" />
          </div>
          <div className="text-[10px] text-neutral-500 font-mono flex items-center space-x-1">
            <span>{testimonial.location}</span>
            {testimonial.prizeWon && (
              <>
                <span className="text-neutral-700">•</span>
                <span className="text-amber-500 font-medium">Ganhou: {testimonial.prizeWon}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
