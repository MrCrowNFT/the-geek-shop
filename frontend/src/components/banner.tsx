import { useState } from "react";
import { BannerItem, BannerData } from "../types/banner";
import { mockBannerData } from "../mock/banner-mock";

interface BannerWrapperProps {
  bannerData?: BannerData;
}

const BannerWrapper: React.FC<BannerWrapperProps> = ({
  bannerData = mockBannerData,
}) => {
  // Animation state for hover effects
  const [hoveredBanner, setHoveredBanner] = useState<string | null>(null);

  // Reusable banner component with animations
  const BannerImage = ({ banner }: { banner: BannerItem }) => {
    const isHovered = hoveredBanner === banner.id;

    return (
      <a
        href={banner.href}
        className="block h-full w-full overflow-hidden relative"
        onMouseEnter={() => setHoveredBanner(banner.id)}
        onMouseLeave={() => setHoveredBanner(null)}
      >
        <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 hover:opacity-100 z-10" />
        <img
          src={banner.src}
          alt={banner.alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </a>
    );
  };

  return (
    <div className="mx-[7%] max-w-full">
      <div className="flex flex-col gap-2 h-screen">
        {/* Upper content half */}
        <div className="flex-1 flex h-1/2 p-0 m-0 overflow-hidden">
          {bannerData.upper.map((banner) => (
            <BannerImage key={banner.id} banner={banner} />
          ))}
        </div>

        {/* Lower content half */}
        <div className="flex flex-row gap-2 flex-1 h-1/2">
          {/* Left section */}
          <div className="flex flex-col gap-2 w-1/3 h-full">
            {bannerData.lowerLeft.map((banner) => (
              <div key={banner.id} className="flex flex-1 overflow-hidden">
                <BannerImage banner={banner} />
              </div>
            ))}
          </div>

          {/* Center section */}
          <div className="flex-1 flex justify-center">
            {bannerData.lowerCenter.map((banner) => (
              <BannerImage key={banner.id} banner={banner} />
            ))}
          </div>

          {/* Right section */}
          <div className="flex flex-col gap-2 w-1/3 h-full">
            {bannerData.lowerRight.map((banner) => (
              <div key={banner.id} className="flex flex-1 overflow-hidden">
                <BannerImage banner={banner} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerWrapper;
