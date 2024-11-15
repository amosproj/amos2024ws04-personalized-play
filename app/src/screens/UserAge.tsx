import { Button, H3, Input, Text } from "@shadcn/components";
import type React from "react";
import { useState } from "react";
import { Alert, Platform, Image, View, ToastAndroid } from "react-native";

// Define the shape of the age state
interface Age {
  years: number;
  months: number;
  days: number;
}

// Function to calculate age in years, months, and days
const calculateAge = (
  birthDate: Date
): { years: number; months: number; days: number } => {
  const today = new Date();

  // Calculate the difference in years, months, and days
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjust if the birthday hasn't occurred yet this year
  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months = (months + 12) % 12;
  }

  if (days < 0) {
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0);
    days += lastMonth.getDate();
    months = (months + 11) % 12;
  }

  // Ensure age doesn't go negative
  if (years < 0) years = months = days = 0;

  return { years, months, days };
};

// Helper function to validate date fields
const validateDateFields = (
  day: string,
  month: string,
  year: string
): string | null => {
  const dayInt = Number.parseInt(day);
  const monthInt = Number.parseInt(month);
  const yearInt = Number.parseInt(year);
  const today = new Date();
  const currentYear = today.getFullYear();

  // Validate if all fields are filled
  if (!day || !month || !year) return "Please enter all fields.";

  // Validate Day (between 1 and 31)
  if (dayInt < 1 || dayInt > 31)
    return "Please enter a valid day between 1 and 31.";

  // Validate Month (between 1 and 12)
  if (monthInt < 1 || monthInt > 12)
    return "Please enter a valid month between 1 and 12.";

  // Validate Year (not greater than current year)
  if (yearInt > currentYear || yearInt < 1900) {
    return `Please enter a valid year between 1900 and ${currentYear}.`;
  }

  // Check if the date is valid
  const birthDate = new Date(yearInt, monthInt - 1, dayInt); // Month is 0-indexed
  if (
    birthDate.getFullYear() !== yearInt ||
    birthDate.getMonth() !== monthInt - 1 ||
    birthDate.getDate() !== dayInt
  ) {
    return "Invalid date entered.";
  }
  // Check if the date is in the future
  if (birthDate > today) {
    return "Date cannot be in the future";
  }

  return null; // All fields are valid
};

export const UserAge: React.FC = () => {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [age, setAge] = useState<Age>({ years: 0, months: 0, days: 0 });

  const handleSubmit = () => {
    // Validate the input fields
    const validationError = validateDateFields(day, month, year);
    if (validationError) {
      if (Platform.OS === "android") {
        // Use ToastAndroid for Android
        ToastAndroid.showWithGravity(
          validationError,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      } else {
        // Use Alert for other platforms (iOS, Web, etc.)
        Alert.alert("Invalid Input", validationError);
      }

      return;
    }

    // Parse date values
    const dayInt = Number.parseInt(day);
    const monthInt = Number.parseInt(month);
    const yearInt = Number.parseInt(year);

    // Calculate and save the age
    const { years, months, days } = calculateAge(
      new Date(yearInt, monthInt - 1, dayInt)
    );
    setAge({ years, months, days });
  };

  return (
    <View className="flex-1 justify-center items-center p-4 gap-5 mx-4">
      <Image source={require("../../assets/onboarding.jpg")} />
      <H3>Awesome! How old is she/he/they?</H3>
      <Text>Please enter child's birth date</Text>
      <View className="flex-row w-full justify-between items-center mb-4">
        <Input
          placeholder="Day"
          className="flex-1 mx-1 p-2 text-center"
          value={day}
          onChangeText={(text) => setDay(text)}
          keyboardType="numeric"
          maxLength={2}
        />
        <Input
          placeholder="Month"
          className="flex-1 mx-1 p-2 text-center"
          value={month}
          onChangeText={(text) => setMonth(text)}
          keyboardType="numeric"
          maxLength={2}
        />
        <Input
          placeholder="Year"
          className="flex-1 mx-1 p-2 text-center"
          value={year}
          onChangeText={(text) => setYear(text)}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <Button
        size={"lg"}
        className="w-full rounded-full"
        onPress={handleSubmit}
      >
        <Text>Next</Text>
      </Button>
    </View>
  );
};
