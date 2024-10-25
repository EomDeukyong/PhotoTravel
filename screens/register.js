import auth from '@react-native-firebase/auth';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [userpwd, setUserpwd] = useState('');
  const user = auth().currentUser;

  const handleRegistration = () => {
    auth()
      .createUserWithEmailAndPassword(useremail,userpwd)
      .then(() => {
            auth().currentUser.updateProfile({
              displayName: username,
              email: useremail,
            }).then(() => {
              console.log('Profile updated!');
            }).catch((error) => {
              console.log(error)
            });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });

  }
  return(
    <View>
      <Text>회원가입</Text>
        <Text>이름</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <Text>이메일</Text>
        <TextInput
            style={styles.input}
            value={useremail}
            onChangeText={text => setUseremail(text)}
        />
        <Text>비밀번호</Text>
        <TextInput
            style={styles.input}
            secureTextEntry
            value={userpwd}
            onChangeText={text => setUserpwd(text)}
        />
        <Button title="가입하기" onPress={handleRegistration} />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
export default RegisterScreen;