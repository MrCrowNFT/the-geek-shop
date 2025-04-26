import tgs from "../assets/The Geek Shop.png";
import ds from "../assets/ds.png";
import jjk from "../assets/jjk.png";
import nint from "../assets/nint.jpg";
import pkm from "../assets/pkm.png";
import op from "../assets/op.png";
import { BannerData } from "../types/banner";

//todo, define this as mock data instead.
export const mockBannerData: BannerData = {
  upper: [{ id: "upper-main", src: tgs, alt: "Banner A", href: "#" }],
  lowerLeft: [
    { id: "lower-left-1", src: pkm, alt: "Banner B", href: "#" },
    { id: "lower-left-2", src: ds, alt: "Banner B", href: "#" },
  ],
  lowerCenter: [
    { id: "lower-center", src: op, alt: "Banner C", href: "#" },
  ],
  lowerRight: [
    { id: "lower-right-1", src: jjk, alt: "Banner B", href: "#" },
    { id: "lower-right-2", src: nint, alt: "Banner B", href: "#" },
  ],
};
