import { useNavigation } from '@react-navigation/native';
import { Button, Label, Text } from '@shadcn/components';
import { Input } from '@shadcn/components';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';
import { DeleteAlertIcon } from '@src/components/DeleteAlert';
import { Collections, Screens, Stacks, fireAuth, fireStore } from '@src/constants';
import type { AppNavigation } from '@src/types';
import {
  IconGenderFemale,
  IconGenderMale,
  IconGenderTransgender
} from '@tabler/icons-react-native';
import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore'; // Import deleteDoc
import { Edit3 } from 'lucide-react-native'; // Lucide edit icon
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ScrollView, View } from 'react-native';

interface Kid {
  id: string; // Added to track Firestore document ID
  name: string;
  age: number;
  biologicalSex: string;
  healthConsiderations: string[];
}

export const Profile: React.FC = () => {
  const [user] = useAuthState(fireAuth);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [kids, setKids] = useState<Kid[]>([]);
  const [isUserEditable, setUserEditable] = useState<boolean>(false);
  const [isKidsEditable, setKidsEditable] = useState<boolean>(false);
  const { navigate, reset } = useNavigation<AppNavigation>();
  const auth = getAuth();

  const fetchData = async () => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const userEmail = user.email;
      if (userEmail) {
        setEmail(user.email);
      }

      const userId = user.uid;

      const userDoc = await getDoc(doc(fireStore, Collections.Users, userId));

      if (userDoc) {
        const userData = userDoc.data();
        setUsername(userData?.displayName);
      }

      const kidsCollection = await getDocs(
        collection(fireStore, Collections.Users, userId, Collections.Kids)
      );

      const kidsData: Kid[] = kidsCollection.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // Store Firestore document ID for updates
          name: data?.name || 'Unknown',
          age: data?.age || 0,
          biologicalSex: data?.biologicalSex || '',
          healthConsiderations: data?.healthConsiderations || []
        };
      });
      setKids(kidsData);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const saveUser = async () => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const userId = user.uid;

      const userDocRef = doc(fireStore, Collections.Users, userId);

      await updateDoc(userDocRef, { displayName: username });

      setUserEditable(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const saveKids = async () => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const userId = user.uid;

      const batch = writeBatch(fireStore);

      // biome-ignore lint/complexity/noForEach: <explanation>
      kids.forEach((kid) => {
        const kidDocRef = doc(fireStore, Collections.Users, userId, Collections.Kids, kid.id);
        batch.update(kidDocRef, {
          name: kid.name,
          age: kid.age,
          biologicalSex: kid.biologicalSex,
          healthConsiderations: kid.healthConsiderations
        });
      });

      await batch.commit();
      setKidsEditable(false);
    } catch (error) {
      console.error('Error saving kids data:', error);
    }
  };

  const deleteKid = async (kidId: string) => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const userId = user.uid;
      const kidDocRef = doc(fireStore, Collections.Users, userId, Collections.Kids, kidId);
      await deleteDoc(kidDocRef);

      // Remove kid from local state
      setKids((prevKids) => prevKids.filter((kid) => kid.id !== kidId));
    } catch (error) {
      console.error('Error deleting kid:', error);
    }
  };

  //Log out functionality
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        reset({
          index: 0,
          routes: [
            {
              name: Stacks.UnAuth,
              params: { screen: Screens.SignIn }
            }
          ]
        });
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onChangeKid = (index: number, field: keyof Kid, value: any) => {
    setKids((prevKids) =>
      prevKids.map((kid, idx) => (idx === index ? { ...kid, [field]: value } : kid))
    );
  };

  return (
    <ScrollView className='flex-1'>
      {/* User Details Section */}
      <View className='w-10/12 m-auto'>
        <View className='flex flex-row items-center justify-between mb-4'>
          <Text className='text-xl font-bold'>User Details</Text>
          {!isUserEditable ? (
            <Edit3
              size={20}
              color='#000'
              onPress={() => setUserEditable(!isUserEditable)}
              className='ml-2'
            />
          ) : null}
        </View>

        <View className='w-full flex mb-4'>
          <Label className='mb-4'>Email</Label>
          <Input
            placeholder='Your email'
            value={email}
            readOnly={true}
            aria-labelledby='inputLabel'
            aria-errormessage='inputError'
          />
        </View>

        <View className='w-full flex mb-4'>
          <Label className='mb-4'>Username</Label>
          <Input
            placeholder='Your username'
            value={username}
            onChangeText={setUsername}
            readOnly={!isUserEditable}
            aria-labelledby='inputLabel'
            aria-errormessage='inputError'
            className='w-full mb-4'
          />
        </View>
        {isUserEditable && (
          <Button onPress={saveUser} className='self-end'>
            <Text>Save</Text>
          </Button>
        )}
      </View>

      {/* Kids Details Section */}
      <View className='w-10/12 m-auto'>
        <View className='flex flex-row items-center justify-between mb-4'>
          <Text className='text-xl font-bold'>Kids Details</Text>
          {!isKidsEditable ? (
            <Edit3 size={20} color='#000' onPress={() => setKidsEditable(true)} className='ml-2' />
          ) : null}
        </View>
        <View className='flex-col gap-y-4'>
          {kids.map((kid, index) => (
            <View key={kid.id} className='border border-gray-300 p-4 rounded-lg mb-4'>
              {isKidsEditable ? (
                <View>
                  <View className='mx-1 mb-4'>
                    <View className='flex flex-row items-center justify-between mb-2'>
                      <Label>
                        <Text>Name</Text>
                      </Label>
                      <DeleteAlertIcon
                        title={'Confirm Deletion'}
                        description={
                          "Are you sure you want to delete this child's information? This action cannot be undone."
                        }
                        onDelete={() => deleteKid(kid.id)}
                      />
                    </View>
                    <Input
                      placeholder='Name'
                      value={kid.name}
                      onChangeText={(text) => onChangeKid(index, 'name', text)}
                      readOnly={!isKidsEditable}
                      className='w-full'
                    />
                  </View>

                  <View className='flex flex-row mx-1 mb-4'>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text>Age</Text>
                      </Label>
                      <Input
                        placeholder='Age'
                        value={String(kid.age)}
                        onChangeText={(text) => onChangeKid(index, 'age', Number(text))}
                        keyboardType='numeric'
                        readOnly={!isKidsEditable}
                      />
                    </View>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text>Gender</Text>
                      </Label>
                      <ToggleGroup
                        disabled={!isKidsEditable}
                        value={kid.biologicalSex}
                        onValueChange={(value) => onChangeKid(index, 'biologicalSex', value)}
                        type='single'
                        className='flex flex-row gap-x-2'
                      >
                        <ToggleGroupItem value='male' className='rounded-xl'>
                          <ToggleGroupIcon icon={IconGenderMale} size={18} />
                        </ToggleGroupItem>
                        <ToggleGroupItem value='female' className='rounded-xl'>
                          <ToggleGroupIcon icon={IconGenderFemale} size={18} />
                        </ToggleGroupItem>
                        <ToggleGroupItem value='transgender' className='rounded-xl'>
                          <ToggleGroupIcon icon={IconGenderTransgender} size={18} />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </View>
                  </View>

                  <View className='mx-1 mb-4'>
                    <Label className='mb-2'>Health Considerations</Label>
                    <Input
                      placeholder='Health Considerations'
                      value={kid.healthConsiderations.join(', ')}
                      onChangeText={(text) =>
                        onChangeKid(
                          index,
                          'healthConsiderations',
                          text.split(',').map((t) => t.trim())
                        )
                      }
                      readOnly={!isKidsEditable}
                      className='w-full'
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <Text className='text-2xl mb-4'>{kid.name}</Text>
                  <View className='flex flex-row mx-1 mb-4'>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text>Age</Text>
                      </Label>
                      <Text className='text-l'>{kid.age}</Text>
                    </View>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text>Gender</Text>
                      </Label>
                      {kid.biologicalSex === 'male' ? (
                        <ToggleGroupIcon icon={IconGenderMale} size={18} />
                      ) : null}
                      {kid.biologicalSex === 'female' ? (
                        <ToggleGroupIcon icon={IconGenderFemale} size={18} />
                      ) : null}
                      {kid.biologicalSex === 'transgender' ? (
                        <ToggleGroupIcon icon={IconGenderTransgender} size={18} />
                      ) : null}
                    </View>
                  </View>

                  <View className='flex flex-row mx-1 mb-4'>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text>Health Considerations</Text>
                      </Label>
                      <Text className='text-l'>
                        {kid.healthConsiderations.length === 0
                          ? 'None.'
                          : kid.healthConsiderations.join(', ')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
        {isKidsEditable ? (
          <Button onPress={saveKids} className='self-end'>
            <Text>Save</Text>
          </Button>
        ) : null}
        <Button onPress={handleLogout}>
          <Text>Log Out</Text>
        </Button>
      </View>
    </ScrollView>
  );
};
