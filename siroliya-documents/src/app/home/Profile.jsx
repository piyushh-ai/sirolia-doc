import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '../../hooks/useAuth'

const Profile = () => {
    const {user} = useAuth()
  return (
    <View>
      <Text>Profile : {user?.name}</Text>
    </View>
  )
}

export default Profile