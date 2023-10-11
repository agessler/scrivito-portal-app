import { load } from 'scrivito'
import { ProductInstance } from '../../Objs/Product/ProductObjClass'
import type { DataItem } from '../../utils/additionalTypes'
import { CartItem } from './CartItemDataClass'

export function addToCart(product: ProductInstance): void {
  const productId = product.id()

  // @ts-expect-error until out of private beta
  CartItem.create({ productId })
}

export async function removeFromCart(product: ProductInstance): Promise<void> {
  const productId = product.id()

  const items: DataItem[] = await load(() =>
    // @ts-expect-error until out of private beta
    CartItem.all().transform({ filters: { productId } }).take(),
  )

  items.forEach((item) => item.destroy())
}

export function isInCart(product: ProductInstance): boolean {
  const productId = product.id()

  // @ts-expect-error until out of private beta
  return CartItem.all().transform({ filters: { productId } }).containsData()
}

export function containsItems(): boolean {
  // @ts-expect-error until out of private beta
  return CartItem.all().containsData()
}

export async function checkoutCart(): Promise<void> {
  // @ts-expect-error until out of private beta
  const cartItems: DataItem[] = await load(() => CartItem.all().take())

  const checkedOutItems = cartItems.map((item) => ({
    productId: item.get('productId'),
  }))
  // push checkedOutItems to your favorite backend
  console.log('Checked out', checkedOutItems)

  const destroyPromises = cartItems.map((item) => item.destroy())
  await Promise.all(destroyPromises)
}
