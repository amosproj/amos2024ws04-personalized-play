import { useNavigation } from '@react-navigation/native';
import { Button } from '@shadcn/components';
import { EditActivityButton } from '@src/components/EditActivityButton';
import { Collections, fireAuth, fireStore } from '@src/constants';
import { Screens, Stacks } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { UserIcon } from 'lucide-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

export type Activity = {
  id: string;
  name: string;
  activityType: string;
  duration: number;
  energy: number;
  favorite: boolean;
};

type User = {
  name: string;
  profilePicture?: string; // Optional profile picture
};

export const Favorite: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  const [user] = useAuthState(fireAuth);
  const [favoriteActivities, setFavoriteActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchActivities = async () => {
    if (!user) {
      console.log('No user found!');
      setLoading(false);
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

      const activities: Activity[] = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();

        // Push activityType into the array if favorite is true
        if (data.activityType && doc.id && data.favorite) {
          activities.push({
            id: doc.id,
            name: data.name as string,
            activityType: data.activityType as string,
            duration: Number.parseInt(data.duration),
            energy: Number.parseInt(data.energy),
            favorite: data.favorite || false
          });
        }
      }

      setFavoriteActivities(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  async function updateActivity(updateData: Activity) {
    if (!user) return;

    try {
      const activityRef = doc(
        fireStore,
        Collections.Users,
        user.uid,
        Collections.Activities,
        updateData.id
      );

      await updateDoc(activityRef, {
        name: updateData.name,
        activityType: updateData.activityType,
        duration: updateData.duration,
        energy: updateData.energy,
        favorite: updateData.favorite
      });

      fetchActivities();
      return true;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const renderActivityBox = ({ item }: { item: Activity }) => (
    <View className={`p-4 rounded-lg mb-4 flex-row ${item.favorite ? 'bg-secondary' : ''}`}>
      <Text
        className={`flex-1 text-lg font-semibold mb-2 ${item.favorite ? 'text-secondary-foreground' : ''}`}
      >
        {item.name}
      </Text>
      <View className='flex-row gap-x-2'>
        {/* Replay Button */}
        <Button onPress={() => navigate(Stacks.Auth, { screen: Screens.ActivityPlayer, params: { activityId: item.id } })}>
          <Text className='text-primary-foreground font-semibold'>Replay</Text>
        </Button>

        {/* Edit Button */}
        <EditActivityButton updateActivity={updateActivity} activity={item} />
      </View>
    </View>
  );

  return (
    <View className='flex flex-1 bg-white p-4'>
      {/* User Profile Section */}
      <View className='flex-row items-center mb-4'>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} className='w-10 h-10 rounded-full mr-3' />
        ) : (
          <View className='w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center'>
            <UserIcon className='text-gray-500 w-6 h-6' />
          </View>
        )}
        <Text className='text-l font-bold'>
          Welcome {user?.displayName || user?.email || 'Guest'}!
        </Text>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
        <>
          {/* Favorites Section */}
          <Text className='text-2xl font-bold mb-2 mt-2'>Favorites</Text>
          {favoriteActivities.length === 0 ? (
            <Text className='text-center text-lg text-gray-500'>No favorite activities found.</Text>
          ) : (
            <FlatList
              data={favoriteActivities}
              keyExtractor={(item) => item.id}
              renderItem={renderActivityBox}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
};
