import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

import GeminiInReact from "@/components/user_defined_components/Gemini";
import CardInner from "@/components/user_defined_UI/cardInner";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <CardInner>
        <GeminiInReact/>
      </CardInner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: '#3a414a',
    borderRadius: 7,
  },
});