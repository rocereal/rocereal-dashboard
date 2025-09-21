"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";

import backgroundThree from "@/app/assets/images/background_three.jpg";

const AppRight = () => {
  return (
    <div className="relative w-full h-screen">
      <div className="relative overflow-hidden h-[30vh] lg:h-screen w-full lg:w-3/4 flex flex-col">
        {/* ImageComponentOptimized placeholder - replace with your actual component */}
        <ImageComponentOptimized
          unoptimized={true}
          alt={"Fisio"}
          src={backgroundThree}
          placeholder="blur"
          fill
          className="object-cover"
        />
      </div>

      {/* Black overlay square at bottom */}
      <div className="absolute bg-black w-24 h-24 bottom-1/2 z-10 left-0"></div>
    </div>
  );
};

export default AppRight;
