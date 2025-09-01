export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_Sy7VVKXAToLikX',
    priceId: 'price_1S2BGAFo9Nuy6V7lu5e4Z7C5',
    name: 'Pro',
    description: 'Your are very pro for gettign vortex pro',
    mode: 'subscription'
  },
  {
    id: 'prod_Sy7U9nSLUxhQWt',
    priceId: 'price_1S2BFUFo9Nuy6V7lDaw8AVHx',
    name: 'Ultra',
    description: 'You are so sigma for getting vortex ultra',
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};