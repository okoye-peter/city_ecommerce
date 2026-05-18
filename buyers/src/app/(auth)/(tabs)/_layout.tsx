import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react'
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TableLayout = () => {
    return (
        <>
            <StatusBar style='dark' />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#1E1E1E',
                    tabBarInactiveTintColor: '#757575',
                    tabBarLabelStyle: { marginTop: 2 },
                    tabBarStyle: {
                        paddingTop: 6,
                        paddingBottom: 8,
                    }
                }}
            >
                <Tabs.Screen
                    name='ExploreScreen'
                    options={{
                        tabBarLabel: 'Explore',
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="compass" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='SearchScreen'
                    options={{
                        tabBarLabel: 'Search',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="search" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='OrdersScreen'
                    options={{
                        tabBarLabel: 'Orders',
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="package" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='ProfileScreen'
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="user-circle-o" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}

export default TableLayout