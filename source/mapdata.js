import firestore from '@react-native-firebase/firestore';

export function addMarker(latitude, longitude, name, uri, uid) {
  // 새로운 마커 객체 생성
  firestore()
    .collection('Map')
    .add({
      latitude: parseFloat(latitude), // latitude를 숫자로 변환해서 저장
      longitude: parseFloat(longitude),
      filename: name,
      image: uri,
      userId: uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log('Image added!');
    });
    /*
    firestore().collection('Map').doc('markers').onSnapshot(documentSnapshot => {
      console.log('User data: ', documentSnapshot.data().image);
    });
*/
}

