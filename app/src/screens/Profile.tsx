import { Button, Text } from '@shadcn/components';
import { Input } from '@shadcn/components';
import { Collections, fireAuth, fireStore } from '@src/constants';
import { collection, doc, getDoc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';
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

  const onChangeUsername = (data: string) => {
    setUsername(data);
  };

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

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onChangeKid = (index: number, field: keyof Kid, value: any) => {
    setKids((prevKids) =>
      prevKids.map((kid, idx) => (idx === index ? { ...kid, [field]: value } : kid))
    );
  };

  return (
    <ScrollView className='flex-1'>
      {/* User Details Section */}
      <View>
        <View className='flex flex-row items-center justify-between mb-4'>
          <Text className='text-xl font-bold'>User Details</Text>
          <Edit3
            size={20}
            color='#000'
            onPress={() => setUserEditable(!isUserEditable)}
            className='ml-2'
          />
        </View>
        <Input
          placeholder='Your email'
          value={email}
          readOnly={true}
          aria-labelledby='inputLabel'
          aria-errormessage='inputError'
          className='w-full mb-4'
        />
        <Input
          placeholder='Your username'
          value={username}
          onChangeText={setUsername}
          readOnly={!isUserEditable}
          aria-labelledby='inputLabel'
          aria-errormessage='inputError'
          className='w-full mb-4'
        />
        {isUserEditable && (
          <Button onPress={saveUser} className='self-end'>
            <Text>Save</Text>
          </Button>
        )}
      </View>

      {/* Kids Details Section */}
      <View>
        <View className='flex flex-row items-center justify-between mb-4'>
          <Text className='text-xl font-bold'>Kids Details</Text>
          <Edit3
            size={20}
            color='#000'
            onPress={() => setKidsEditable(!isKidsEditable)}
            className='ml-2'
          />
        </View>
        <View className='flex-col gap-y-4'>
          {kids.map((kid, index) => (
            <View key={kid.id} className='border border-gray-300 p-4 rounded-lg mb-4'>
              <Input
                placeholder='Name'
                value={kid.name}
                onChangeText={(text) => onChangeKid(index, 'name', text)}
                readOnly={!isKidsEditable}
                className='w-full mb-2'
              />
              <Input
                placeholder='Age'
                value={String(kid.age)}
                onChangeText={(text) => onChangeKid(index, 'age', Number(text))}
                keyboardType='numeric'
                readOnly={!isKidsEditable}
                className='w-[48%]'
              />
              <Input
                placeholder='Biological Sex'
                value={kid.biologicalSex}
                onChangeText={(text) => onChangeKid(index, 'biologicalSex', text)}
                readOnly={!isKidsEditable}
                className='w-[48%]'
              />
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
          ))}
        </View>
        {isKidsEditable ? (
          <Button onPress={saveKids} className='self-end'>
            <Text>Save</Text>
          </Button>
        ) : null}
      </View>
    </ScrollView>
  );
};
