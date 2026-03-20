/** Featured products for the marketing landing (FASCO-style ecommerce hero). */
export interface LandingProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  imageAlt: string;
}

export const LANDING_PRODUCTS: LandingProduct[] = [
  {
    id: 'p1',
    name: 'Tailored wool coat',
    price: 298,
    image:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=720&h=900&fit=crop&q=80',
    imageAlt: 'Model in a neutral tailored coat',
  },
  {
    id: 'p2',
    name: 'Silk evening dress',
    price: 245,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=720&h=900&fit=crop&q=80',
    imageAlt: 'Elegant dress on a hanger',
  },
  {
    id: 'p3',
    name: 'Leather crossbody',
    price: 189,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=720&h=900&fit=crop&q=80',
    imageAlt: 'Leather handbag detail',
  },
  {
    id: 'p4',
    name: 'Cashmere knit',
    price: 156,
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=720&h=900&fit=crop&q=80',
    imageAlt: 'Folded soft knit sweater',
  },
];

export const LANDING_HERO_IMAGE =
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=1750&fit=crop&q=80';

export const LANDING_PROMO_IMAGE =
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop&q=80';
