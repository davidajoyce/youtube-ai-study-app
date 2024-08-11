import { LogBox, Text, View } from "react-native";
import Login from '../components/Login'
import {auth} from '../configs/FirebaseConfig'
import { Redirect } from "expo-router";
import { UsePushNotifications } from '../components/Notifications/UsePushNotifications';

// LogBox.ignoreAllLogs();

export default function Index() {
  const { expoPushToken, notification } = UsePushNotifications();
  console.log("expoPushToken")
  console.log(expoPushToken)

  const data = JSON.stringify(notification);
  console.log("expoPushNotification")
  console.log(data)

  const user=auth.currentUser;

  return ( 
    <View
      style={{
        flex: 1,
      }}
    >
      {user?
        <Redirect href={'/mytrip'}/>:
        <Login/>
      }
     
    </View>
  );
}
