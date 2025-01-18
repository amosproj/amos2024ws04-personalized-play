import { useNavigation } from '@react-navigation/native';
import { Button, Label, Text } from '@shadcn/components';
import { Input } from '@shadcn/components';
import { Badge } from '@shadcn/components/ui/badge';
import { Card, CardHeader } from '@shadcn/components/ui/card';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { DeleteAlertIcon } from '@src/components/DeleteAlert';
import { HealthConsiderationsAlert } from '@src/components/HealthConsiderationsDialog';
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
import { Baby, CircleArrowRight, Edit3 } from 'lucide-react-native'; // Lucide edit icon
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ScrollView, View } from 'react-native';

iconWithClassName(Baby);

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
  }, [user, isKidsEditable, isUserEditable]);

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
          <Label className='mb-2'>
            <Text className='text-sm'>Email</Text>
          </Label>
          <Input
            placeholder='Your email'
            value={email}
            readOnly={true}
            aria-labelledby='inputLabel'
            aria-errormessage='inputError'
          />
        </View>

        <View className='w-full flex mb-4'>
          <Label className='mb-2 text-sm'>
            <Text className='text-sm'>Username</Text>
          </Label>
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
                  <View className='mx-1 mb-6'>
                    <View className='flex flex-row items-center justify-between mb-2'>
                      <Label>
                        <Text className='text-sm'>Name</Text>
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
                      className='w-full text-md'
                    />
                  </View>

                  <View className='flex flex-row mx-1 mb-6'>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text className='text-sm'>Age in Months</Text>
                      </Label>
                      <Input
                        className='text-md'
                        placeholder='Age'
                        value={String(kid.age)}
                        onChangeText={(text) => onChangeKid(index, 'age', Number(text))}
                        keyboardType='numeric'
                        readOnly={!isKidsEditable}
                      />
                    </View>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text className='text-sm'>Biological Sex</Text>
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
                    <View className='flex flex-row justify-between mb-2'>
                      <Label className='mb-2'>
                        <Text className='text-sm'>Health Considerations</Text>
                      </Label>
                      <HealthConsiderationsAlert
                        title='Health Considerations'
                        currentOptions={kid.healthConsiderations}
                        onSave={(selected) => {
                          onChangeKid(index, 'healthConsiderations', selected);
                        }}
                      />
                    </View>
                    <View className='flex flex-row flex-wrap gap-2'>
                      {kid.healthConsiderations?.map((consideration, index) => (
                        <Badge
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          key={index}
                          variant='outline'
                          className='px-2 py-1'
                        >
                          <Text className='text-md'>{consideration}</Text>
                        </Badge>
                      ))}
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View className='flex flex-row gap-2 items-center mb-6'>
                    <Baby strokeWidth={2} className='text-primary' />
                    <Text className='text-2xl text-primary'>{kid.name}</Text>
                  </View>

                  <View className='flex flex-row mx-1 mb-6'>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text className='text-sm'>Age in Months</Text>
                      </Label>
                      <Text className='text-md'>{kid.age} Months</Text>
                    </View>
                    <View className='w-1/2'>
                      <Label className='mb-2'>
                        <Text className='text-sm'>Biological Sex</Text>
                      </Label>
                      {kid.biologicalSex === 'male' ? (
                        <ToggleGroupIcon icon={IconGenderMale} size={20} />
                      ) : null}
                      {kid.biologicalSex === 'female' ? (
                        <ToggleGroupIcon icon={IconGenderFemale} size={20} />
                      ) : null}
                      {kid.biologicalSex === 'transgender' ? (
                        <ToggleGroupIcon icon={IconGenderTransgender} size={20} />
                      ) : null}
                    </View>
                  </View>

                  <View className='flex flex-row mx-1 mb-6'>
                    <View>
                      <Label className='mb-4'>
                        <Text className='text-sm'>Health Considerations</Text>
                      </Label>
                      {kid.healthConsiderations.length === 0 ? (
                        <Text className='text-l'>'None.'</Text>
                      ) : (
                        <View className='flex flex-row flex-wrap gap-2'>
                          {kid.healthConsiderations?.map((consideration, index) => (
                            <Badge
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={index}
                              variant='outline'
                              className='px-2 py-1 text-sm min-w-12'
                            >
                              <Text className='text-md'>{consideration}</Text>
                            </Badge>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
        {isKidsEditable ? (
          <View className='flex flex-row gap-2 justify-end'>
            <Button
              onPress={() => {
                setKidsEditable(false);
              }}
              className='self-end bg-transparent border-primary border-[1px]'
            >
              <Text className='text-primary'>Cancel</Text>
            </Button>
            <Button onPress={saveKids} className='self-end'>
              <Text>Save</Text>
            </Button>
          </View>
        ) : null}

        <View className='flex w-full justify-center mt-6 mb-2'>
          <Card className='w-full max-w-sm h-20 bg-primary'>
            <CardHeader className='flex-row  items-center justify-between'>
              <Text className='text-primary-foreground'>Add a Kid</Text>
              <CircleArrowRight
                color='#ffffff'
                onPress={() => navigate(Stacks.Auth, { screen: Screens.NewKid })}
              />
            </CardHeader>
          </Card>
        </View>
        <View className='flex w-full justify-center mt-6 mb-2'>
          <Button className='w-1/3' onPress={handleLogout}>
            <Text>Log Out</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};
