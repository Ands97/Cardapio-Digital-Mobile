import { ActivityIndicator } from "react-native";

import {
	Container,
	CategoriesContainer,
	MenuContainer,
	Footer,
	FooterContainer,
	CenteredContainer,
} from "./styles";

import { Header } from "../components/Header";
import { Categories } from "../components/Categories";
import { Menu } from "../components/Menu";
import { Button } from "../components/Button";
import { TableModal } from "../components/TableModal";
import { useEffect, useState } from "react";
import { Cart } from "../components/Cart";
import { ICartItem } from "../types/ICartItem";
import { IProduct } from "../types/IProduct";

import { Empty } from "../components/Icons/Empty";
import { Text } from "../components/Text";
import { ICategory } from "../types/ICategory";
import { useApi } from "../hooks/useApi";

export function Main() {
	const api = useApi();

	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState("");
	const [cartItems, setCartItems] = useState<ICartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [products, setProducts] = useState<IProduct[]>([]);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [isLoadingProducts, setIsLoadingProducts] = useState(false);

	useEffect(() => {
		Promise.all([handleCategories(), handleProducts()]).then(() => {
			setIsLoading(false);
		});
	}, []);

	async function handleSelectCategory(categoryId: string) {
		setIsLoadingProducts(true);

		const response = categoryId
			? await api.getProductByCategoryId(categoryId)
			: await api.getProducts();

		setProducts(response);
		setIsLoadingProducts(false);
	}

	async function handleCategories() {
		const response = await api.getCategories();
		setCategories(response);
	}

	async function handleProducts() {
		const response = await api.getProducts();
		setProducts(response);
	}

	function handleSaveTable(table: string) {
		setSelectedTable(table);
	}

	function handleResetOrder() {
		setSelectedTable("");
		setCartItems([]);
	}

	function handleAddToCart(product: IProduct) {
		if (!selectedTable) {
			setIsTableModalVisible(true);
		}

		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				(cartItem) => cartItem.product._id === product._id
			);

			if (itemIndex < 0) {
				return prevState.concat({
					quantity: 1,
					product,
				});
			}

			const newCartItems = [...prevState];
			const item = newCartItems[itemIndex];
			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity + 1,
			};

			return newCartItems;
		});
	}

	function handleDecrementCartItem(product: IProduct) {
		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				(cartItem) => cartItem.product._id === product._id
			);

			const item = prevState[itemIndex];
			const newCartItems = [...prevState];

			if (item.quantity == 1) {
				newCartItems.splice(itemIndex, 1);
				return newCartItems;
			}

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity - 1,
			};

			return newCartItems;
		});
	}
	return (
		<>
			<Container>
				<Header
					selectedTable={selectedTable}
					onCancelOrder={handleResetOrder}
				/>
				{isLoading ? (
					<CenteredContainer>
						<ActivityIndicator color="#d73035" size="large" />
					</CenteredContainer>
				) : (
					<>
						<CategoriesContainer>
							<Categories
								categories={categories}
								onSelectCategory={handleSelectCategory}
							/>
						</CategoriesContainer>

						{isLoadingProducts ? (
							<CenteredContainer>
								<ActivityIndicator color="#d73035" size="large" />
							</CenteredContainer>
						) : (
							<>
								{products.length ? (
									<MenuContainer>
										<Menu onAddToCart={handleAddToCart} products={products} />
									</MenuContainer>
								) : (
									<CenteredContainer>
										<Empty />

										<Text color="#666" style={{ marginTop: 24 }}>
											Nenhum produto foi encontrado!
										</Text>
									</CenteredContainer>
								)}
							</>
						)}
					</>
				)}
			</Container>
			<Footer>
				<FooterContainer>
					{!selectedTable && (
						<Button
							onPress={() => setIsTableModalVisible(true)}
							disabled={isLoading}
						>
							Novo Pedido
						</Button>
					)}

					{selectedTable && (
						<Cart
							onAdd={handleAddToCart}
							onDecrement={handleDecrementCartItem}
							cartItems={cartItems}
							onConfirmOrder={handleResetOrder}
							selectedTable={selectedTable}
						/>
					)}
				</FooterContainer>
			</Footer>

			<TableModal
				onClose={() => setIsTableModalVisible(false)}
				visible={isTableModalVisible}
				onSave={handleSaveTable}
			/>
		</>
	);
}
