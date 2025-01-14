import { Text } from '@shadcn/components';
import { View } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';

interface LoadingProps {
  heading?: string;
  description?: string;
}

export const Loading: React.FC<LoadingProps> = ({ heading = 'Loading...', description = 'Please wait while we load the list of items.' }) => {
  return (
    <View className="flex flex-1 items-center justify-center animate-pulse">
      <Svg width={120} height={150} viewBox="0 0 80 100" className="mb-4">
        <G transform="translate(-12.439 -2.524)" fill="#620674">
          <Circle cx={36.468} cy={15.509} r={13.009} />
          <Circle cx={66.557} cy={19.764} r={12.451} />
          <Path d="M66.155 36.183c-5.752 0-10.951 2.158-14.729 5.921-3.714-5.784-10.199-9.62-17.584-9.62-11.537 0-21.522 10.584-21.522 22.124 0 17.818 11.598 29.489 23.34 40.989 2.533 2.481 6.664 2.492 8.77.283 2.28-2.388 2.074-6.225-.434-8.734l-8.621-9.878c3.131-4.747 8.512-7.88 14.625-7.88s11.493 3.132 14.624 7.879l-8.621 9.879c-2.508 2.51-2.714 6.347-.436 8.734 2.107 2.209 6.239 2.198 8.772-.283 11.741-11.5 23.34-20.706 23.34-38.525.001-11.538-9.986-20.889-21.524-20.889M50 66.207c-5.579 0-10.104-4.524-10.104-10.104S44.421 45.999 50 45.999c5.58 0 10.104 4.523 10.104 10.104S55.58 66.207 50 66.207" />
        </G>
      </Svg>

      <Text className="text-xl font-bold mt-4 text-center">{heading}</Text>
      <Text className="text-base mt-2 text-center px-4">{description}</Text>
    </View>
  );
};
