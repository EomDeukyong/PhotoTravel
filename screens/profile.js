import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, Alert, StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from "react-native-image-picker";
import MapView, { Marker } from "react-native-maps";
import { addMarker } from "../source/mapdata";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('photo');
  const user = auth().currentUser;
  const uidphotoref = storage().ref(`/profile/${user.uid}`);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [uri, setUri] = useState(' ');
  const [markers, setMarkers] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  var asset;
  var fileURLs = [];
  const MapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ];
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    getFileURLs();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    // 새 마커 추가
    setMarkers([coordinate]);
    // 선택된 좌표 저장
    setSelectedCoordinate(coordinate);
  };

  const handleSave = () => {
    setModalVisible(false);
    addMarker(selectedCoordinate.latitude, selectedCoordinate.longitude, name, uri, user.uid);
    getFileURLs();
  };

  const getFileURLs = async () => {
    const result = await uidphotoref.list();
    // Loop over each item
    fileURLs = [];
    for (const ref of result.items) {
      try {
        const url = await ref.getDownloadURL();
        fileURLs.push(url);
      } catch (error) {
        console.error('Error fetching download URL:', error);
      }
    }
    setFileList(fileURLs);
    setLoading(false);
  };

  const imageUpload = async () => {
    const FolderRef = storage().ref(`/profile/${user.uid}`)
    try {
      // 폴더 내 모든 파일 가져오기
      const fileList = await FolderRef.listAll();
      const fileCount = fileList.items.length; // 파일 수

      console.log(`Number of files`, fileCount);
    } catch (error) {
      console.error('Error retrieving file count:', error);
    }

    if (fileCount >= 10) {
      Alert.alert('준비 중입니다', '이미지 개수가 10개 이상입니다.'); // 알림창 표시
      return; // 업로드 중단
    }
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
        selectionLimit: 1  //선택 최대개수
      },
      async (res) => {
        if (res.didCancel) return;
        const asset = res.assets[0];
        try {
          setLoading(true);
          const reference = storage().ref(`/profile/${user.uid}/${asset.fileName}`);
          await reference.putFile(asset.uri).then(async (result) => {
            setName(result.metadata.name);
            console.log(result);
            const downloadURL = await reference.getDownloadURL();
            setUri(downloadURL); // 다운로드 URL을 상태에 저장하거나 사용
            setLoading(False);
          });
        } catch (error) {
          console.error('File upload error: ', error);
        }
        setModalVisible(true);
      },
    )
  }

  const handleDeleteImage = (imageUrl) => {
    console.log("imageurl" + imageUrl);
    Alert.alert(
      "삭제 확인",
      "이미지를 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "확인",
          onPress: async () => {
            try {
              // Firestore에서 문서 검색
              const querySnapshot = await firestore()
                .collection('Map')
                .where('image', '==', imageUrl)
                .get();

              if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]; // 첫 번째 문서 가져오기
                const imagename = doc.data().filename; // 'imagename' 필드 가져오기
                console.log(imagename);
                // Firestore 문서 삭제
                await doc.ref.delete();

                // Firebase Storage에서 파일 삭제
                const reference = storage().ref(`/profile/${user.uid}/${imagename}`);
                await reference.delete();

                // 파일 목록 업데이트
                await getFileURLs();
              } else {
                console.log('해당 imageUrl에 해당하는 문서가 없습니다.');
              }
            } catch (error) {
              console.error('삭제 중 오류 발생:', error);
            }
          }
        }
      ]
    );
  };

  const handleAccountDeletion = async () => {
    Alert.alert(
      "회원 탈퇴 확인",
      "정말로 회원 탈퇴를 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "확인",
          onPress: async () => {
            try {
              const user = auth().currentUser;
              if (user) {
                // Firestore에서 사용자 데이터 삭제
                try {
                  // userId에 해당하는 모든 문서를 쿼리합니다.
                  const snapshot = await firestore().collection('Map').where('userId', '==', user.uid).get();

                  // 문서가 존재하는 경우에만 삭제합니다.
                  if (!snapshot.empty) {
                    const batch = firestore().batch(); // 배치 삭제를 위해 배치 객체 생성

                    snapshot.forEach((doc) => {
                      batch.delete(doc.ref); // 각 문서를 삭제합니다.
                    });

                    await batch.commit(); // 배치 삭제를 커밋합니다.
                    console.log('All documents for userId deleted successfully!');
                  } else {
                    console.log('No documents found for this userId.');
                  }
                } catch (error) {
                  console.error('Error deleting documents: ', error);
                }
                // Storage에서 사용자 이미지 삭제
                console.log('dd', user.uid)
                const userFolderRef = storage().ref(`/profile/${user.uid}`);

                try {
                  // 폴더 내 모든 파일 가져오기
                  const fileList = await userFolderRef.listAll();

                  // 파일 삭제
                  const deletePromises = fileList.items.map((fileRef) => {
                    return fileRef.delete(); // 각 파일을 삭제합니다.
                  });

                  // 모든 파일 삭제 완료 대기
                  await Promise.all(deletePromises);
                  console.log('All files deleted successfully.');

                } catch (error) {
                  console.error('Error deleting user profile folder:', error);
                }

                // Firebase Authentication에서 사용자 계정 삭제
                await user.delete(); // Delete the user's account
                console.log('User account deleted!');

                // 로그아웃 후 처리
                auth().signOut();
                // 추가적인 처리 필요 시 여기에서 진행
              }
            } catch (error) {
              console.error('Error deleting account: ', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../source/image/basic_profile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.displayName}</Text>
        <Text style={styles.profileDescribe}>{user.email}</Text>
        <Button
          title="로그아웃"
          onPress={() => auth().signOut().then(() => console.log('User signed out!'))}
        />
        <Button
          title="회원 탈퇴"
          color="red" // Optional: Set a different color to indicate the action
          onPress={handleAccountDeletion}
        />
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'photo' && styles.activeTab,
          ]}
          onPress={() => switchTab('photo')}
        >
          <Text style={styles.tabText}>사진</Text>
        </TouchableOpacity>
        {/*
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'album' && styles.activeTab,
          ]}
          onPress={() => switchTab('album')}
        >
          <Text style={styles.tabText}>앨범</Text>
        </TouchableOpacity>
        */}
      </View>
      {activeTab === 'photo' && (
        <View style={styles.tabContent}>
          {loading == false ? (
            <FlatList
              key={'_'}
              data={fileList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onLongPress={() => handleDeleteImage(item)}>
                  <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
                </TouchableOpacity>
              )}
              numColumns={4}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
      )}
      {activeTab === 'album' && (
        <View style={styles.tabContent}>
          <Text>활동 내용을 여기에 표시합니다.</Text>
        </View>
      )}
      {activeTab === 'photo' && (
        <TouchableOpacity style={styles.button} onPress={imageUpload}>
          <Icon name="add-photo-alternate" size={35} color="black" />
        </TouchableOpacity>
      )}
      {activeTab === 'album' && (
        <TouchableOpacity style={styles.button}>
          <Icon name="create-new-folder" size={35} color="black" />
        </TouchableOpacity>
      )}
      <Modal visible={modalVisible} animationType="slide">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 35.9077,
            longitude: 127.7669,
            latitudeDelta: 7.0,
            longitudeDelta: 7.0,
          }}
          customMapStyle={MapStyle}
          onPress={handleMapPress}
        >
          {markers.map((coordinate, index) => (
            <Marker
              key={index}
              coordinate={coordinate}
              title={`마커 ${index + 1}`}
            />
          ))}
        </MapView>
        <View>
          <Button title="저장" onPress={handleSave} />
          <Button title="닫기" onPress={() => setModalVisible(!modalVisible)} />
        </View>

        {selectedCoordinate && (
          <View
            style={{
              position: 'absolute',
              bottom: 100,
              left: 10,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text>선택된 위치:</Text>
            <Text>위도: {selectedCoordinate.latitude}</Text>
            <Text>경도: {selectedCoordinate.longitude}</Text>
          </View>
        )}
      </Modal>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileDescribe: {
    fontSize: 16,
    color: 'gray',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 18,
  },
  tabContent: {
    height: 300,
  },
  button: {
    position: 'absolute',
    bottom: 25, // 아래 여백 조절
    right: 25, // 오른쪽 여백 조절
    backgroundColor: 'white',
    borderRadius: 25, // 버튼을 원 모양으로 만들기 위한 값
    borderWidth: 2,
    borderStyle: 'solid',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    alignItems: 'flex-start',
    minHeight: 500,
    width: 400,
  },
});

export default ProfileScreen;
