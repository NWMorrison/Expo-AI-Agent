import React from "react";
import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import {Link } from "expo-router";



export default function TabOneScreen() {


    return (

      <View style={styles.container}>
{/*
      Clickable hyperlink leading to the AI model. More of less temporary until I think of something else to add
*/}
      <Link href={"/two"} asChild>
        <Pressable>{({ pressed }) => (
          <Text>{ pressed } <u>Go To WILL-LM</u> </Text>)}
        </Pressable>
      </Link>
    </View>

    );
}

//Style sheet for the Home screen.
const styles = StyleSheet.create(
{
  container:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}
);