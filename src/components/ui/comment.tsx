import * as React from "react";
import { cn } from "@/lib/utils";

interface CommentProps extends React.HTMLAttributes<HTMLDivElement> {
  author: string;
  timestamp: string;
  text: string;
}

const Comment = React.forwardRef<HTMLDivElement, CommentProps>(
  ({ className, author, timestamp, text, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "border border-black rounded-xl p-4 dark:border-white",
        className
      )}
      {...props}
    >
      <div className="flex flex-col">
        <div className="flex justify-start items-center gap-4">
          <h3 className="text-lg font-semibold text-white">{author}</h3>
          <p className="text-sm text-gray-400">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
        <p className="text-white mt-2">{text}</p>
      </div>
    </div>
  )
);
Comment.displayName = "Comment";

export { Comment };
