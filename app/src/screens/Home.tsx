import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Card, CardHeader } from '@shadcn/components/ui/card';
import { fireAuth, Screens, Stacks } from '@src/constants';
import { CircleArrowRight, UserIcon } from 'lucide-react-native';
import { Image, View, FlatList, ActivityIndicator } from 'react-native';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import type { AppNavigation } from '@src/types';
import { collection, getDocs } from 'firebase/firestore';
import { fireStore, Collections } from '@src/constants';
import React from 'react';

interface Activity {
  id: string;
  name: string;
  activityType: string;
  duration: number;
  energy: number;
  favorite: boolean;
}

export const Home: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  const [user] = useAuthState(fireAuth);
  const [favoriteActivities, setFavoriteActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFavoriteActivities = async () => {
    if (!user) {
      console.log('No user found!');
      setLoading(false);
      return;
    }

    try {
      const userId = user.uid;

      const activitiesRef = collection(fireStore, Collections.Users, userId, Collections.Activities);
      const querySnapshot = await getDocs(activitiesRef);

      const activities: Activity[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();

        // Check if data is valid and has the necessary fields
        if (data.favorite && data.name && data.activityType) {
          activities.push({
            id: doc.id,
            name: data.name,
            activityType: data.activityType,
            duration: Number.parseInt(data.duration, 10),
            energy: Number.parseInt(data.energy, 10),
            favorite: data.favorite,
          });
        }
      });

      // Get only the first 3 recent activities
      setFavoriteActivities(activities.slice(0, 3));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteActivities();
  }, [user]);

  const renderFavoriteActivity = ({ item }: { item: Activity }) => (
    <View className="p-4 rounded-lg mb-4 flex-row bg-secondary">
      <Text className="flex-1 text-lg font-semibold text-secondary-foreground">{item.name}</Text>
      <View className="flex-row gap-x-2">
        <CircleArrowRight
          color="#ffffff"
          onPress={() => navigate(Stacks.Auth, { screen: Screens.NewPlay })}
        />
      </View>
    </View>
  );

  return (
    <View className="flex flex-1 flex-col px-6 gap-y-4">
      {/* Welcome Section */}
      <View className="flex flex-row items-center gap-x-4">
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} className="w-10 h-10 rounded-full mr-3" />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
            <UserIcon className="text-gray-500 w-6 h-6" />
          </View>
        )}
        <Text className="text-l font-bold text-primary text-xl ">
          Welcome {user?.displayName || user?.email || 'Guest'}!
        </Text>
      </View>

      {/* "Add Fav activities" Card */}
      <Card className="w-full mt-10 h-44 bg-primary flex items-center justify-center">
        <CardHeader className="flex items-center justify-center flex-row space-x-2 gap-24">
          <Text className="text-primary-foreground  text-2xl">Wanna Play?</Text>
          <CircleArrowRight
            color="#ffffff"
            size={40}
            onPress={() => navigate(Stacks.Auth, { screen: Screens.NewPlay })}
          />
        </CardHeader>
      </Card>


      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Recent Favorites */}
          <Text className="text-2xl font-bold mt-4">Added to Favorites</Text>
          {favoriteActivities.length === 0 ? (
            <Text className="text-center text-lg text-gray-500">No favorite activities found.</Text>
          ) : (
            <FlatList
              data={favoriteActivities}
              keyExtractor={(item) => item.id}
              renderItem={renderFavoriteActivity}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
};