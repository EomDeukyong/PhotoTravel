import React, { useEffect } from 'react';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const GoogleSignInComponent = () => {
  useEffect(() => {
    // GoogleSignin 초기 설정
    GoogleSignin.configure({
      webClientId: '498174101385-c0dvlcf688a2pidkoje8ohtce070ir8e.apps.googleusercontent.com'
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      // Google Play 서비스 체크
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // 사용자 로그인
      response= await GoogleSignin.signIn();
      const { idToken } = response.data
      // Firebase에 전달할 자격 증명 생성
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Firebase에 로그인
      return await auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('로그인 취소됨');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('로그인 진행 중...');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Google Play 서비스 사용 불가 또는 업데이트 필요');
            break;
          default:
            console.log('기타 에러:', error);
        }
      } else {
        console.log('Google 로그인 중 오류 발생:', error);
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await onGoogleButtonPress();
          console.log('Google로 로그인 성공!');
        } catch (error) {
          console.error('Google 로그인 중 오류 발생:', error);
        }
      }}
    />
  );
};

export default GoogleSignInComponent;
