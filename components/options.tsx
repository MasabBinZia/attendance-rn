import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Option = ({ options, onChange }: any) => {
  const [activeOption, setActiveOption] = useState(options[0]);

  const updateActiveOption = (option: any) => {
    setActiveOption(option);
    onChange(option);
  };

  return (
    <View style={{ justifyContent: 'center', marginTop: 100, marginBottom: 100 }}>
      {options.map((option: any, index: any) => (
        <TouchableOpacity key={index} onPress={() => updateActiveOption(option)}>
          <View
            style={{
              width: '100%',
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: activeOption === option ? '#67e8f9' : 'white',
              alignItems: 'center',
            }}>
            <Text style={{ color: activeOption === option ? 'white' : 'black' }}>{option}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Option;
