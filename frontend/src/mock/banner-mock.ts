import BannerA from "../../../assets/images/BannerA.png";
import BannerB from "../../../assets/images/BannerB.png";
import BannerC from "../../../assets/images/BannerC.png";
import { BannerData } from "../types/banner";

export const mockBannerData: BannerData = {
  upper: [{ id: "upper-main", src: BannerA, alt: "Banner A", href: "#" }],
  lowerLeft: [
    { id: "lower-left-1", src: BannerB, alt: "Banner B", href: "#" },
    { id: "lower-left-2", src: BannerB, alt: "Banner B", href: "#" },
  ],
  lowerCenter: [
    { id: "lower-center", src: BannerC, alt: "Banner C", href: "#" },
  ],
  lowerRight: [
    { id: "lower-right-1", src: BannerB, alt: "Banner B", href: "#" },
    { id: "lower-right-2", src: BannerB, alt: "Banner B", href: "#" },
  ],
};
