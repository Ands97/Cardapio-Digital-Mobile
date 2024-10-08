import { useState } from "react";
import { Modal, TouchableOpacity, Platform } from "react-native";
import { Button } from "../Button";
import { Close } from "../Icons/Close";
import { Text } from "../Text";
import { Form, Input, ModalBody, ModalHeader, Overlay } from "./styles";

interface TableModalProps {
	visible: boolean;
	onClose(): void;
	onSave(table: string): void;
}

export function TableModal({ visible, onClose, onSave }: TableModalProps) {
	const [table, setTable] = useState("");

	function handleSave(table: string) {
		onSave(table);
		onClose();
		setTable("");
	}
	return (
		<Modal visible={visible} transparent animationType="fade">
			<Overlay behavior={Platform.OS == "ios" ? "padding" : "height"}>
				<ModalBody>
					<ModalHeader>
						<Text weight="600">Informe a mesa</Text>

						<TouchableOpacity onPress={onClose}>
							<Close color="#666" />
						</TouchableOpacity>
					</ModalHeader>
					<Form>
						<Input
							placeholder="Número da mesa"
							placeholderTextColor="#666"
							keyboardType="number-pad"
							onChangeText={setTable}
						/>

						<Button
							disabled={table.length == 0}
							onPress={() => handleSave(table)}
						>
							Salvar
						</Button>
					</Form>
				</ModalBody>
			</Overlay>
		</Modal>
	);
}
