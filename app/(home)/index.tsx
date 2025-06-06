/*

import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SignOutButton } from '@//components/SignOutButton';

export default function HomeIndex() {
    const { user } = useUser()

    return (
        <View>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <Link href="../(auth)/sign-in.tsx">
                    <Text>Sign in</Text>
                </Link>
                <Link href="../(auth)/sign-up.tsx">
                    <Text>Sign up</Text>
                </Link>
            </SignedOut>
        </View>
    )
}*/
