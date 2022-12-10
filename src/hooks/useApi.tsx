import axios from "axios";
import { config } from "../config";
import { ICategory } from "../types/ICategory";
import { IOrder } from "../types/IOrder";
import { IProduct } from "../types/IProduct";

const api = axios.create({
	baseURL: config.api.url,
});

export function useApi() {
	return {
		getCategories: async () => {
			const { data }: { data: ICategory[] } = await api.get("/categories");
			return data;
		},

		getProducts: async () => {
			const { data }: { data: IProduct[] } = await api.get("/products");
			return data;
		},

		getProductByCategoryId: async (categoryId: string) => {
			const { data }: { data: IProduct[] } = await api.get(
				`/categories/${categoryId}/products`
			);
			return data;
		},

		setOrder: async (order: IOrder) => {
			const { data } = await api.post("/orders", order);
			return data as boolean;
		},
	};
}
