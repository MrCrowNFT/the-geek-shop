import { motion } from "framer-motion";
import { BannerItem, BannerData } from "../types/banner";

interface BannerProps {
  bannerData: BannerData;
}

const Banner: React.FC<BannerProps> = ({ bannerData }) => {
  return (
    <div className="mx-[7%] max-w-full">
      <div className="flex flex-col gap-2 h-screen">
        {/* Upper content half */}
        <div className="flex-1 flex h-1/2 p-0 m-0 overflow-hidden">
          {bannerData.upper.map((banner, index) => (
            <BannerImage key={banner.id} banner={banner} index={index} />
          ))}
        </div>

        {/* Lower content half */}
        <div className="flex flex-row gap-2 flex-1 h-1/2">
          {/* Left section */}
          <div className="flex flex-col gap-2 w-1/3 h-full">
            {bannerData.lowerLeft.map((banner, index) => (
              <div key={banner.id} className="flex flex-1 overflow-hidden">
                <BannerImage banner={banner} index={index} />
              </div>
            ))}
          </div>

          {/* Center section */}
          <div className="flex-1 flex justify-center">
            {bannerData.lowerCenter.map((banner, index) => (
              <BannerImage key={banner.id} banner={banner} index={index} />
            ))}
          </div>

          {/* Right section */}
          <div className="flex flex-col gap-2 w-1/3 h-full">
            {bannerData.lowerRight.map((banner, index) => (
              <div key={banner.id} className="flex flex-1 overflow-hidden">
                <BannerImage banner={banner} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerImage = ({ banner, index }: { banner: BannerItem; index: number }) => {
  return (
    <motion.a
      href={banner.href}
      className="block h-full w-full overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <img
        src={banner.src}
        alt={banner.alt}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </motion.a>
  );
};

export default Banner;
