import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Dologin = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.push('Login')}
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 회색 배경
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // 배경을 클릭할 수 있도록 투명하게 설정
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Dologin;