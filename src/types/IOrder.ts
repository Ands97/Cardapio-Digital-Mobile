export interface IOrder {
	table: string;
	products: { product: string; quantity: number }[];
}
