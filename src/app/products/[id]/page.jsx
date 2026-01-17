import { ItemDetails } from '@/components/items/ItemDetails';

export default async function ProductDetails({ params }) {
  const { id } = await params;

  return <ItemDetails itemId={id} />;
}
