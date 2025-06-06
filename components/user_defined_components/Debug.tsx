import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';

export function DebugEnvironment() {
    useEffect(() => {
        console.log('Environment Debug:', {
            directEnv: process.env.REACT_APP_GEMINI_API_KEY,
            constants2Extra: Constants.manifest2?.extra
        });
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text>Check console for environment debug info</Text>
        </View>
    );
}
