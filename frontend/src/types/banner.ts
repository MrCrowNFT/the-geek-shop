export interface BannerItem {
    id: string;
    src: string;
    alt: string;
    href: string;
  }
  
  export interface BannerData {
    upper: BannerItem[];
    lowerLeft: BannerItem[];
    lowerCenter: BannerItem[];
    lowerRight: BannerItem[];
  }