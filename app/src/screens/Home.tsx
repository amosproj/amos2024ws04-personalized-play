import { useFocusEffect, useNavigation} from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Card, CardHeader } from '@shadcn/components/ui/card';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { Screens, Stacks, fireAuth } from '@src/constants';
import { Collections, fireStore } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { CircleArrowRight, RotateCcw, UserIcon, UserRoundCog } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import type React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

iconWithClassName(UserRoundCog);

interface Activity {
  id: string;
  name: string;
}

export const Home: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  const [user] = useAuthState(fireAuth);
  const [favoriteActivities, setFavoriteActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const getUserData = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(fireStore, Collections.Users, user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // Document exists - you can access the data
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  };

  const isUserOnboarded = async () => {
    const userData = await getUserData();
    if (!userData) {
      return false;
    }
    return userData.isOnboarded;
  };

  const fetchFavoriteActivities = async () => {
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

      // biome-ignore lint/complexity/noForEach: <explanation>
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Check if data is valid and has the necessary fields
        if (data.favorite && data.activity.name) {
          activities.push({
            id: doc.id,
            name: data.activity.name
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

  const onNewPlayPressed = () => {
    if (isOnboarded) {
      navigate(Stacks.Auth, { screen: Screens.NewPlay });
      return;
    }
    navigate(Stacks.Auth, { screen: Screens.Onboarding });
  };

  const onHistoryBtnPressed = () => {
    navigate(Stacks.Auth, { screen: Screens.History });
  };

  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      fetchFavoriteActivities();
    }, [])
  );

  useEffect(() => {
    const checkUserOnboarded = async () => {
      const userOnboarded = await isUserOnboarded();
      setIsOnboarded(userOnboarded);
      setLoading(false);
    };
    checkUserOnboarded();
  }, []);

  const renderFavoriteActivity = ({ item }: { item: Activity }) => (
    <View className='w-full p-4 rounded-lg mb-4 flex flex-row justify-between bg-secondary'>
      <Text className='flex-1 text-lg font-semibold text-secondary-foreground'>{item.name}</Text>
      <RotateCcw
        color='#ffffff'
        onPress={() =>
          navigate(Stacks.Auth, { screen: Screens.ActivityPlayer, params: { activityId: item.id } })
        }
      />
    </View>
  );

  return (
    <View className='flex flex-1 flex-col px-6 gap-y-4'>
      {/* Welcome Section */}
      <View className='flex flex-row items-center justify-between mt-4'>
        <View className='flex flex-row items-center gap-x-4'>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} className='w-10 h-10 rounded-full mr-3' />
          ) : (
            <View className='w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center'>
              <UserIcon className='text-gray-500 w-6 h-6' />
            </View>
          )}
          <Text className='text-l font-bold text-primary text-xl '>
            Hi {user?.displayName || 'There'}!
          </Text>
        </View>
        <UserRoundCog
          className='text-primary'
          onPress={() => navigate(Stacks.Auth, { screen: Screens.Profile })}
        />
      </View>

      {/* "Add Fav activities" Card */}
      <Card className='w-full mt-10 h-44 bg-primary flex items-center justify-center'>
        <CardHeader className='flex items-center justify-center flex-row space-x-2 gap-24'>
          <Text className='text-primary-foreground  text-2xl'>Wanna Play?</Text>
          <CircleArrowRight
            color='#ffffff'
            size={40}
            onPress={onNewPlayPressed}
            disabled={loading}
          />
        </CardHeader>
      </Card>

      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <View className='w-full flex'>
          <View className="flex-row items-center justify-between my-4">
            {/* Recent Favorites */}
            <Text className='text-2xl font-bold my-4'>Added to Favorites</Text>
            <TouchableOpacity onPress={onHistoryBtnPressed}>
              <Ionicons name="time-outline" size={30} className="mr-3" color="#620674"/>
            </TouchableOpacity>
          </View>
          {favoriteActivities.length === 0 ? (
            <Text className='text-center text-lg text-gray-500'>No favorite activities found.</Text>
          ) : (
            <FlatList
              data={favoriteActivities}
              keyExtractor={(item) => item.id}
              renderItem={renderFavoriteActivity}
              className='flex flex-row w-full'
              contentContainerStyle={{ flex: 1 }}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
};
