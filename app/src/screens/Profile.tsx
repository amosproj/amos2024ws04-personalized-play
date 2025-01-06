import { Button, Text } from '@shadcn/components';
import { useEffect, useState } from 'react';
import { Collections, fireAuth, fireStore } from '@src/constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { View } from 'react-native';
import { Input } from '@shadcn/components';
import { collection, doc, getDoc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';

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

  const onChangeKid = (index: number, field: keyof Kid, value: any) => {
    setKids((prevKids) =>
      prevKids.map((kid, idx) => (idx === index ? { ...kid, [field]: value } : kid))
    );
  };

  return (
    <View className='flex flex-1 items-center justify-center'>
      {/* User Details Section */}
      <View>
        <Text>User Details</Text>
        {!isUserEditable ? (
          <Button
            onPress={() => {
              setUserEditable(true);
            }}
          >
            <Text>Edit</Text>
          </Button>
        ) : null}
        <Input
          placeholder='your email'
          value={email}
          readOnly={true}
          aria-labelledby='inputLabel'
          aria-errormessage='inputError'
        />
        <Input
          placeholder='your username'
          value={username}
          onChangeText={onChangeUsername}
          readOnly={!isUserEditable}
          aria-labelledby='inputLabel'
          aria-errormessage='inputError'
        />
        {isUserEditable ? (
          <Button onPress={saveUser}>
            <Text>Save</Text>
          </Button>
        ) : null}
      </View>

      {/* Kids Details Section */}
      <View>
        <Text>Kids Details</Text>
        {!isKidsEditable ? (
          <Button
            onPress={() => {
              setKidsEditable(true);
            }}
          >
            <Text>Edit</Text>
          </Button>
        ) : null}
        <View className='flex-col gap-y-4'>
          {kids.map((kid, index) => (
            <View key={kid.id} className='flex flex-col items-start'>
              <Input
                placeholder='Name'
                value={kid.name}
                onChangeText={(text) => onChangeKid(index, 'name', text)}
                readOnly={!isKidsEditable}
              />
              <Input
                placeholder='Age'
                value={String(kid.age)}
                onChangeText={(text) => onChangeKid(index, 'age', Number(text))}
                keyboardType='numeric'
                readOnly={!isKidsEditable}
              />
              <Input
                placeholder='Biological Sex'
                value={kid.biologicalSex}
                onChangeText={(text) => onChangeKid(index, 'biologicalSex', text)}
                readOnly={!isKidsEditable}
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
              />
            </View>
          ))}
        </View>
        {isKidsEditable ? (
          <Button onPress={saveKids}>
            <Text>Save</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
};
