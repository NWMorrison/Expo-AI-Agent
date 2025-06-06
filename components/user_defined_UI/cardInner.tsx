import {StyleSheet, View, ViewProps} from "react-native";
import React from "react";

interface CardInnerProps extends ViewProps
{
    children?: React.ReactNode;
}

export default function CardInner({ children, ...props }: CardInnerProps)
{
    return ( <View style={styles.container} {...props}> {children} </View> );
}



const styles = StyleSheet.create(
{
    container:
    {
        alignItems: 'center',
        backgroundColor: '#979ea8',
        /*Arc of your corners*/
        borderRadius: 15,


        flexDirection: 'row',

        flexWrap: 'wrap',

        /*{Justify will put the text on the left with flex start}*/
        justifyContent: 'flex-start',
        margin: 5,
        padding: 10,

        /*Puts spacing between the cards*/
        paddingBottom: 20,
    }
}
);
