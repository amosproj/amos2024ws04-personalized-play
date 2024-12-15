import { UserIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fireAuth, fireStore, Collections } from '@src/constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs } from 'firebase/firestore';
import type { AppNavigation } from '@src/types';
import { Screens, Stacks } from '@src/constants';


type Activity = {
  id: string;
  title: string;
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


  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        console.log('No user found!');
        setLoading(false);
        return;
      }

      console.log('User Info:', user); // Log user details

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
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Document Data:', data); // Log each document's data

          // Push activityType into the array if favorite is true
          if (data.activityType && doc.id && data.favorite) {
            activities.push({
              id: doc.id,
              title: data.activityType, // Use activityType as title
              favorite: data.favorite || false,
            });
          }
        });

        console.log('Favorite Activities:', activities); // Verify filtered activities
        setFavoriteActivities(activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchActivities();
  }, [user]);

  const renderActivityBox = ({ item }: { item: Activity }) => (
    <View
      className={`p-4 rounded-lg mb-4 flex-row ${item.favorite ? 'bg-gray-200' : ''}`}
    >
      <Text
        className={`flex-1 text-lg font-semibold mb-2 ${item.favorite ? 'text-black' : ''}`}
      >
        {item.title}
      </Text>
      <View className="flex-row gap-x-2">
        {/* Replay Button */}
        <TouchableOpacity
          className="bg-gray-400 px-2 py-2 m-auto"
          onPress={() => navigate(Stacks.Auth, { screen: Screens.Home })}
        >
          <Text className="text-white font-semibold">Replay</Text>
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity
          className="bg-gray-400 px-2 py-2 m-auto"
        onPress={() => navigate(Stacks.Auth, { screen: Screens.Home })}
        >
          <Text className="text-white font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex flex-1 bg-white p-4">
      {/* User Profile Section */}
      <View className="flex-row items-center mb-4">
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
            <UserIcon className="text-gray-500 w-6 h-6" />
          </View>
        )}
        <Text className="text-l font-bold">Welcome {user?.displayName || user?.email}!</Text>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {/* Favorites Section */}
          <Text className="text-2xl font-bold mb-2 mt-2">Favorites</Text>
          {favoriteActivities.length === 0 ? (
            <Text className="text-center text-lg text-gray-500">No favorite activities found.</Text>
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
