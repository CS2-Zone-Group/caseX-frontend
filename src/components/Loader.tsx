"use client";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function Loader({ fullScreen = false, size = "md", text }: LoaderProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-gray-700 border-t-cyan-500 animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeMap[size]} rounded-full border-2 border-transparent border-b-blue-500 animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
      </div>
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
