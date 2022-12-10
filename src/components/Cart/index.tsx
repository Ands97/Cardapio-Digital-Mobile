import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { config } from "../../config";
import { useApi } from "../../hooks/useApi";
import { ICartItem } from "../../types/ICartItem";
import { IOrder } from "../../types/IOrder";
import { IProduct } from "../../types/IProduct";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../Button";
import { MinusCircle } from "../Icons/MinusCircle";
import { PlusCircle } from "../Icons/PlusCircle";
import { OrderConfirmedModal } from "../OrderConfirmedModal";
import { Text } from "../Text";
import {
	Actions,
	Image,
	Item,
	ProductContainer,
	ProductDetails,
	QuantityContainer,
	Summary,
	TotalContainer,
} from "./styles";

interface CartProps {
	cartItems: ICartItem[];
	onAdd(product: IProduct): void;
	onDecrement(product: IProduct): void;
	onConfirmOrder(): void;
	selectedTable: string;
}

export function Cart({
	cartItems,
	onAdd,
	onDecrement,
	onConfirmOrder,
	selectedTable,
}: CartProps) {
	const api = useApi();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const total = cartItems.reduce((acc, cartItem) => {
		return acc + cartItem.quantity * cartItem.product.price;
	}, 0);

	async function handleConfirmOrder() {
		const order: IOrder = {
			table: selectedTable,
			products: cartItems.map((cartItem) => ({
				product: cartItem.product._id,
				quantity: cartItem.quantity,
			})),
		};
		setIsLoading(true);
		await api.setOrder(order);
		setIsLoading(false);
		setIsModalVisible(true);
	}

	function handleOk() {
		onConfirmOrder();
		setIsModalVisible(false);
	}
	return (
		<>
			{cartItems.length > 0 && (
				<FlatList
					data={cartItems}
					keyExtractor={(cartItem) => cartItem.product._id}
					showsVerticalScrollIndicator={false}
					style={{ marginBottom: 20, maxHeight: 150 }}
					renderItem={({ item: cartItem }) => (
						<Item>
							<ProductContainer>
								<Image
									source={{
										uri: `${config.api.url}/uploads/${cartItem.product.imagePath}`,
									}}
								/>
								<QuantityContainer>
									<Text size={14} color="#666">
										{cartItem.quantity}x
									</Text>
								</QuantityContainer>
								<ProductDetails>
									<Text size={14} weight="600">
										{cartItem.product.name}
									</Text>
									<Text size={14} color="#666" style={{ marginTop: 4 }}>
										{formatCurrency(cartItem.product.price)}
									</Text>
								</ProductDetails>
							</ProductContainer>
							<Actions>
								<TouchableOpacity
									style={{ marginRight: 24 }}
									onPress={() => onAdd(cartItem.product)}
								>
									<PlusCircle />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => onDecrement(cartItem.product)}>
									<MinusCircle />
								</TouchableOpacity>
							</Actions>
						</Item>
					)}
				/>
			)}
			<Summary>
				<TotalContainer>
					{cartItems.length > 0 ? (
						<>
							<Text color="#666">Total</Text>
							<Text size={20} weight="600">
								{formatCurrency(total)}
							</Text>
						</>
					) : (
						<Text color="#999">Seu carrinho está vazio</Text>
					)}
				</TotalContainer>
				<Button
					disabled={cartItems.length == 0}
					onPress={() => handleConfirmOrder()}
					loading={isLoading}
				>
					Confirmar pedido
				</Button>
			</Summary>

			<OrderConfirmedModal
				visible={isModalVisible}
				onOk={handleOk}
			></OrderConfirmedModal>
		</>
	);
}
