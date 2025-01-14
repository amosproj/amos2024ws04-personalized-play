import { Text } from '@shadcn/components';
import { fireAuth } from '@src/constants';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const History: React.FC = () => {
  const [user] = useAuthState(fireAuth);
  const [activeTab, setActiveTab] = React.useState<'all' | 'favorites'>('all');

  const [items, setItems] = React.useState([
    {
      id: '1',
      date: '20 Dec 2024, 13:10',
      activity: 'Activity with cooking pasta',
      isFavourite: true
    },
    {
      id: '2',
      date: '21 Dec 2024, 14:20',
      activity: 'Activity with reading a book',
      isFavourite: false
    },
    {
      id: '3',
      date: '18 Dec 2024, 12:00',
      activity: 'Activity with toys',
      isFavourite: true
    },
    {
      id: '4',
      date: '19 Dec 2024, 17:15',
      activity: 'Activity with painting',
      isFavourite: false
    }
  ]);

  const handleToggleFavourite = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isFavourite: !item.isFavourite } : item
      )
    );
  };

  // Decide which items to show based on activeTab
  const itemsToShow =
    activeTab === 'all' ? items : items.filter((item) => item.isFavourite === true);

  // Icon color
  const iconColor = '#620674';

  return (
    <View className='flex-1 bg-white'>
      {/* Header Section */}
      <View className='pt-12 px-4 pb-4'>
        {/* Avatar + Welcome Row */}
        <View className='flex-row items-center mb-6'>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} className='w-8 h-8 rounded-full mr-2' />
          ) : (
            <FeatherIcon name='user' size={28} color={iconColor} style={{ marginRight: 8 }} />
          )}

          <Text className='text-xl font-semibold text-primary'>
            {`Welcome ${user?.displayName || user?.email || 'User'}!`}
          </Text>
        </View>

        {/* Tabs */}
        <View className='flex-row'>
          <TouchableOpacity onPress={() => setActiveTab('all')}>
            <View className='mr-6 items-center'>
              <Text
                className={`mb-1 text-base ${
                  activeTab === 'all' ? 'font-semibold text-primary' : 'text-primary/50'
                }`}
              >
                All
              </Text>
              {activeTab === 'all' && <View className='h-1 w-6 bg-primary mt-1' />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('favorites')}>
            <View className='mr-6 items-center'>
              <Text
                className={`mb-1 text-base ${
                  activeTab === 'favorites' ? 'font-semibold text-primary' : 'text-primary/50'
                }`}
              >
                Favorites
              </Text>
              {activeTab === 'favorites' && <View className='h-1 w-14 bg-primary mt-1' />}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* List of Items */}
      <ScrollView className='flex-1'>
        {itemsToShow.map((item) => (
          <View
            key={item.id}
            className='flex-row items-center justify-between bg-gray-100 px-4 py-3 mx-4 mb-2 rounded-md'
          >
            {/* Item Info */}
            <View>
              <Text className='text-sm text-primary/70'>{item.date}</Text>
              <Text className='text-base text-primary'>{item.activity}</Text>
            </View>

            {/* Action Buttons in two rows (2x2) */}
            <View>
              {/* Top row */}
              <View className='flex-row'>
                <TouchableOpacity className='m-2' onPress={() => handleToggleFavourite(item.id)}>
                  {/* If isFavourite = true => heart (filled), else => heart-outline */}
                  <MCIIcon
                    name={item.isFavourite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={iconColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity className='m-2'>
                  <MCIIcon name='brain' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
              {/* Bottom row */}
              <View className='flex-row'>
                <TouchableOpacity className='m-2'>
                  <FeatherIcon name='edit-3' size={20} color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity className='m-2'>
                  <FeatherIcon name='refresh-cw' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
