import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Collections, Screens, Stacks, fireAuth, fireStore } from '@src/constants';
import type { HistoryActivity } from '@src/types';
import type { AppNavigation } from '@src/types';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { UserIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import type { IconProps } from 'react-native-vector-icons/Icon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const History: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  const [user] = useAuthState(fireAuth);
  const [activeTab, setActiveTab] = React.useState<'all' | 'favorites'>('all');
  const [items, setItems] = React.useState([] as HistoryActivity[]);

  const MCIIcon = MaterialCommunityIcons as unknown as React.FC<IconProps>;
  const FeatherIconCasted = FeatherIcon as unknown as React.FC<IconProps>;

  const fetchFavoriteActivities = async () => {
    if (!user) {
      console.log('No user found!');
      return;
    }

    try {
      const userId = user.uid;

      const activitiesRef = collection(
        fireStore,
        Collections.Users,
        userId,
        Collections.Activities
      );

      const querySnapshot = await getDocs(activitiesRef);

      const activities: HistoryActivity[] = [];

      // biome-ignore lint/complexity/noForEach: <explanation>
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Check if data is valid and has the necessary fields
        activities.push({
          id: doc.id,
          activity: data.activity.name,
          // set description length to 100 characters
          description:
            data.activity.description.length > 100
              ? `${data.activity.description.substring(0, 30)}...`
              : data.activity.description,
          isFavourite: data.favorite || false
        });
      });

      // Add fetched activities to state
      setItems(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchFavoriteActivities();
  }, [user]);

  const handleToggleFavourite = (itemId: string) => {
    if (!user) {
      console.log('No user found! ');
      return;
    }

    // Update firebase activity favorite status
    const activityRef = doc(fireStore, Collections.Users, user.uid, Collections.Activities, itemId);
    const activity = items.find((item) => item.id === itemId);

    if (!activity) {
      console.log('No activity found!');
      return;
    }

    // Update activity favorite status
    activity.isFavourite = !activity.isFavourite;

    // Update firebase
    setItems([...items]);
    updateDoc(activityRef, { favorite: activity.isFavourite });
  };

  const replayActivity = (itemId: string) => {
    navigate(Stacks.Auth, {
      screen: Screens.ActivityPlayer,
      params: { activityId: itemId }
    });
  };

  const onHomeBtnPressed = () => {
    navigate(Stacks.Auth, { screen: Screens.Home });
  };

  // Decide which items to show based on activeTab
  const itemsToShow =
    activeTab === 'all' ? items : items.filter((item) => item.isFavourite === true);

  // Icon color
  const iconColor = '#620674';

  return (
    <View className='flex flex-1 flex-col px-6 gap-y-4'>
      <View className='flex flex-row items-center justify-between mt-4'>
        <View className='flex flex-row items-center gap-x-4'>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} className='w-10 h-10 rounded-full mr-3' />
          ) : (
            <View className='w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center'>
              <UserIcon className='text-gray-500 w-6 h-6' />
            </View>
          )}
          <Text className='text-l font-bold text-primary text-xl '>History</Text>
        </View>

        <TouchableOpacity onPress={onHomeBtnPressed} className='ml-auto'>
          <FeatherIconCasted name='home' size={27} color='#620674' />
        </TouchableOpacity>
      </View>

      <View className='pt-1 px-4 pb-4'>
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
            <View style={{ width: '75%' }}>
              <Text className='text-base text-primary'>{item.activity}</Text>
              <Text className='text-sm text-primary/70'>{item.description}</Text>
            </View>

            {/* Action Buttons in two rows (2x2) */}
            <View style={{ width: '25%' }}>
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
                  <FeatherIconCasted name='edit-3' size={20} color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity className='m-2' onPress={() => replayActivity(item.id)}>
                  <FeatherIconCasted name='refresh-cw' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
