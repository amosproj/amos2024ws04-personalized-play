import React, { useState } from 'react';
import {
	View,
	TextInput,
	Image,
	Text,
	SafeAreaView,
	TouchableOpacity
} from 'react-native';
import { Asset } from 'expo-asset';

export const ContextualQuestionNumberKids = () => {
	const [number, setNumber] = useState('');

	const image = Asset.fromModule(require('../../assets/question-number-kids.png')).uri;

	const handleNumberChange = (value: string) => {
		// Only allow numeric input
		if (/^\d*$/.test(value)) {
			setNumber(value);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="p-4 flex h-full">
				<View className="w-full aspect-square bg-gray-200 overflow-hidden mb-10">
					<Image
						source={{ uri: image }}
						className="w-full h-full"
						resizeMode="cover"
					/>
				</View>

				<View className="w-full">
					<Text className="font-bold text-gray-700 text-center text-2xl mb-6">
						How many kids are there with you?
					</Text>
					<TextInput
						value={number}
						onChangeText={handleNumberChange}
						placeholder="Enter a number"
						keyboardType="numeric"
						className="w-full px-4 py-3 border border-slate-600 text-base text-black"
						placeholderTextColor="#666"
					/>
				</View>
				<View className="mt-auto w-full">
					<TouchableOpacity className="bg-slate-600 py-3 px-11">
						<Text className="text-center text-white text-xl">Next</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};