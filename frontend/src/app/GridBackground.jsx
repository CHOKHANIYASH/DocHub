import React from "react";

export default function GridBackground({ children }) {
  return (
    <div className="h-[45rem] w-full  bg-gray-100   bg-grid-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center  bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="relative z-20 py-8 text-4xl font-bold text-center text-transparent sm:text-7xl bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-500">
        {children}
      </p>
    </div>
  );
}
