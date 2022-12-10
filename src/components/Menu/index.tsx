import { useState } from "react";
import { FlatList } from "react-native";
import { config } from "../../config";

import { IProduct } from "../../types/IProduct";
import { formatCurrency } from "../../utils/formatCurrency";
import { PlusCircle } from "../Icons/PlusCircle";
import { ProductModal } from "../ProductModal";
import { Text } from "../Text";
import {
	ProductImage,
	Product,
	ProductDetails,
	Separator,
	AddToCartButton,
} from "./styles";

interface MenuProps {
	onAddToCart(product: IProduct): void;
	products: IProduct[];
}

export function Menu({ onAddToCart, products }: MenuProps) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<null | IProduct>(null);
	function handleOpenModal(product: IProduct) {
		setIsModalVisible(true);
		setSelectedProduct(product);
	}
	return (
		<>
			<FlatList
				data={products}
				style={{ marginTop: 32 }}
				contentContainerStyle={{ paddingHorizontal: 24 }}
				keyExtractor={(product) => product._id}
				ItemSeparatorComponent={Separator}
				renderItem={({ item: product }) => (
					<Product onPress={() => handleOpenModal(product)}>
						<ProductImage
							source={{
								uri: `${config.api.url}/uploads/${product.imagePath}`,
							}}
						/>
						<ProductDetails>
							<Text weight="600">{product.name}</Text>
							<Text color="#666" size={14} style={{ marginVertical: 8 }}>
								{product.description}
							</Text>
							<Text size={14} weight="600">
								{formatCurrency(product.price)}
							</Text>
						</ProductDetails>
						<AddToCartButton onPress={() => onAddToCart(product)}>
							<PlusCircle />
						</AddToCartButton>
					</Product>
				)}
			/>
			<ProductModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				product={selectedProduct}
				onAddToCart={onAddToCart}
			/>
		</>
	);
}
