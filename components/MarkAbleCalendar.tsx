import React from "react";
import { Calendar } from "react-native-calendars";

interface MarkedDate {
  date: string;
  selected: boolean;
  marked: boolean;
  selectedColor: string;
}

interface MarkAbleCalendarProps {
  markedDates: MarkedDate[];
  currentDate: string;
}

const MarkAbleCalendar = ({
  markedDates,
  currentDate,
}: MarkAbleCalendarProps) => {
  const transformedMarkedDates = markedDates.reduce(
    (acc: any, item: MarkedDate) => {
      acc[item.date] = {
        selected: item.selected,
        marked: item.marked,
        selectedColor: item.selectedColor,
      };
      return acc;
    },
    {}
  );

  return (
    <Calendar
      style={{
        borderWidth: 1,
        borderColor: "gray",
        height: 350,
      }}
      current={currentDate}
      onDayPress={(day: any) => {
        console.log("selected day", day);
      }}
      markedDates={transformedMarkedDates}
    />
  );
};

export default MarkAbleCalendar;
