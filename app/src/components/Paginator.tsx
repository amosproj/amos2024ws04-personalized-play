import { View, Text, Animated, useWindowDimensions, StyleSheet } from 'react-native'
import React from 'react'

export default function Paginator({ data, scrollX }: { data: [any], scrollX: Animated.Value }) {

	const { width } = useWindowDimensions()

	return (
		<View className='flex flex-row h-64 w-full justify-center gap-6'>
			{data.map((_, i) => {

				const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

				const dotWidth = scrollX.interpolate({
					inputRange,
					outputRange: [10, 20, 10],
					extrapolate: "clamp"
				})

				const opacity = scrollX.interpolate({
					inputRange,
					outputRange: [0.3, 1, 0.3],
					extrapolate: "clamp"
				})

				return <Animated.View key={i.toString()} className="bg-primary" style={[styles.dot, { width: dotWidth, opacity: opacity }]} />
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	dot: {
		height: 10,
		borderRadius: 5,
		marginHorizontal: 8
	}
})