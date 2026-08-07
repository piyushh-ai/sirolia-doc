import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '../../hooks/useAuth'

import { Typography } from '../../constants/fonts'

const Profile = () => {
    const {user} = useAuth()
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={Typography.h2}>Profile : {user?.name}</Text>
    </View>
  )
}

export default Profile