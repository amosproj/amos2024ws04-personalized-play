import React, { useState } from "react";
import { View, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "firebase-config";

import { ContextualQuestionActivityChoice } from "./ContextualQuestionActivityChoice";
import { ContextualQuestionAgeKids } from "./ContextualQuestionAgeKids";
import { ContextualQuestionEnergyLevel } from "./ContextualQuestionEnergyLevel";
import { ContextualQuestionNumberKids } from "./ContextualQuestionNumberKids";
import { ContextualQuestionPlayTime } from "./ContextualQuestionPlayTime";
import { ContextualQuestionUserName } from "./ContextualQuestionUserName";
import { date, number, string } from "yup";

const db = getFirestore(app);

function UserDetails() {
    const [activityChoice, setActivityChoice] = useState("");
    const [ageKids, setAgeKids] = useState("");
    const [energyLevel, setEnergyLevel] = useState("");
    const [numberOfKids, setNumberOfKids] = useState("");
    const [playTime, setPlayTime] = useState(15); // Default slider value
    const [userName, setUserName] = useState("");

    const saveToFirebase = async () => {
        try {
            await addDoc(collection(db, "userResponses"), {
                activityChoice: string,
                ageKids: number,
                energyLevel: number,
                numberOfKids: number,
                playTime: number,
                userName: string,
                createdAt: date,
            });
            Alert.alert("Success", "Data saved successfully!");
        } catch (error: any) {
            console.error("Error saving data:", error.message, error.code);
            Alert.alert("Error", "Failed to save data.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ContextualQuestionUserName
                onNext={() => { } }
                userName={userName}
                setUserName={setUserName} />
            <ContextualQuestionNumberKids
                onNext={() => { } }
                numberOfKids={numberOfKids}
                setNumberOfKids={setNumberOfKids} />
            <ContextualQuestionPlayTime time={playTime} setTime={setPlayTime} />
            <ContextualQuestionActivityChoice
                activityChoice={activityChoice}
                setActivityChoice={setActivityChoice} />
            <ContextualQuestionAgeKids ageKids={ageKids} setAgeKids={setAgeKids} />
            <ContextualQuestionEnergyLevel
                energyLevel={energyLevel}
                setEnergyLevel={setEnergyLevel} />
            <Button title="Save to Firebase" onPress={saveToFirebase} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1, // Ensures proper scrolling
  },
});

export default UserDetails;
