import BannerA from "../assets/BannerA.jpg";
import BannerB from "../assets/BannerB.jpg";
import BannerC from "../assets/BannerC.jpg";
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
