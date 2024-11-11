import { View, Text, FlatList, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import Paginator from '../components/Paginator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '@shadcn/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingType } from '../types/OnboardingType';
import { ContextualQuestionNumberKids } from '../components/ContextualQuestionNumberKids';

export default function Onboarding() {

	const [showError, setShowError] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0);
	const scrollX = useRef(new Animated.Value(0)).current;
	const slidesRef = useRef(null);
	const onboarding = useRef(new OnboardingType()).current;
	const [successfullAnsweredScreens, setSuccessfullAnsweredScreens] = useState<number[]>([]);

	const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
		setCurrentIndex(viewableItems[0].index)
	}).current;


	const setCurrentScreenAnswered = (answered: boolean) => {
		if (answered) {
			// If not already in array, add current screen index
			setSuccessfullAnsweredScreens(prev =>
				prev.includes(currentIndex)
					? prev
					: [...prev, currentIndex]
			);
		} else {
			// Remove current screen index if it exists
			setSuccessfullAnsweredScreens(prev =>
				prev.filter(index => index !== currentIndex)
			);
		}
	}

	const wasCurrentScreenAnswered = (): boolean => {
		return successfullAnsweredScreens.includes(currentIndex);
	}

	const renderItem = ({ item }: { item: any }) => (
		//<OnboardingItem item={item} />

		<View className='w-screen' >
			<ContextualQuestionNumberKids setCurrentScreenAnswered={setCurrentScreenAnswered} type={onboarding} />
		</View >
	);

	const scrollTo = () => {
		if (!wasCurrentScreenAnswered()) {
			setShowError(true)
			return;
		}
		setShowError(false)
		if (onboarding) {
			console.log(onboarding)
		}
		const currentSlidesRef = slidesRef.current;
		if (currentIndex < DemoData.length - 1 && currentSlidesRef) {
			currentSlidesRef.scrollToIndex({ index: currentIndex + 1 })
		}
	}

	const errorText = showError ? "Error" : ""

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className='flex-1'>
				<View className='flex-[0.8]'>
					<FlatList
						horizontal
						pagingEnabled
						data={DemoData}
						renderItem={renderItem}
						keyExtractor={item => item.id}
						bounces={false}
						showsHorizontalScrollIndicator={false}
						onViewableItemsChanged={viewableItemsChanged}
						ref={slidesRef}
						onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
							useNativeDriver: false,
						})}
					/>
				</View>
				<View className='flex-[0.2] p-4 gap-5'>
					<View className='flex-1'>
						<View className='flex-[0.5]'>
							{showError && <Text className='text-center p-2 rounded border border-rose-600 text-red-700'>Error</Text>}
						</View>
						<View className='flex-[0.5] gap-5'>
							<Button onPress={(e) => scrollTo()} variant={"default"}>
								<Text className='text-white'>Next</Text>
							</Button>
							<Paginator data={DemoData} scrollX={scrollX} />
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
	/*
	return (
		<View>
			<FlatList horizontal
				showsHorizontalScrollIndicator={false}
				pagingEnabled
				data={DemoData}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <OnboardingItem item={item} />} />
			<Text>Onboarding</Text>
		</View>
	)
		*/
}

const DemoData = [
	{
		id: 1,
		title: "test",
		description: "123",
		image: require("../../assets/adaptive-icon.png")
	},
	{
		id: 2,
		title: "test2",
		description: "1234",
		image: require("../../assets/adaptive-icon.png")
	}
]