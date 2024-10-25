import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, ScrollView, Alert, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import GoogleSignInComponent from './googlelogin'

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert(
        '로그인 실패',
        '이메일과 패스워드를 입력해주세요',
        [{ text: 'OK' }]
      );
      return;
    }
  
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        console.log('User signed in successfully');
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert(
            '로그인 실패',
            '유저를 찾을 수 없습니다',
            [{ text: 'OK' }]
          );
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert(
            '로그인 실패',
            '패스워드가 맞지 않습니다',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            '로그인 실패',
            '이메일과 패스워드를 다시 확인해 주세요',
            [{ text: 'OK' }]
          );
          console.log('Error signing in:', error);
        }
      });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={require('../source/image/logo.png')} // 로고 이미지 파일 경로를 지정하세요
          style={styles.logo}
        />
        <Text style={styles.heading}>로그인</Text>
        <TextInput
          style={styles.input}
          placeholder="사용자 이름을 입력하세요"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        <GoogleSignInComponent />
        <TouchableOpacity style={styles.registerButton} onPress={()=>navigation.push('Register')}>
          <Text style={styles.registerText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 400,
    height: 300,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  registerText: {
    color: 'red',             // 텍스트 색상을 빨간색으로 지정
    textDecorationLine: 'underline',  // 밑줄 추가
    fontSize: 13,
  },
  registerButton: {
    width: '70%',
    alignItems: 'flex-end',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;