import React from 'react'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

const _layout = () => {
  return (
    <>
        <StatusBar style='dark' />
        <Tabs 
            screenOptions={{ 
                headerShown: false,
                tabBarActiveTintColor: '#1E1E1E',
                tabBarInactiveTintColor: '#757575',
                tabBarLabelStyle: { marginTop: 4 },
            }}
        >
            <Tabs.Screen
            name='HomeScreen' 
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="layers" size={size} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='ShopScreen' 
            options={{
                tabBarLabel: 'Shop',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="storefront-outline" size={size} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='OrdersScreen' 
            options={{
                tabBarLabel: 'Orders',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="shopping-bag" size={size} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='EarningsScreen' 
            options={{
                tabBarLabel: 'Earnings',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="trending-up" size={size} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='ProfileScreen' 
            options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="user" size={size} color={color} />
                ),
            }}
            />
        </Tabs>
    </>

  )
}

export default _layout