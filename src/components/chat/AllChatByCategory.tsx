import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View ,Animated, Pressable, TouchableWithoutFeedback} from 'react-native'
import React, { useRef,useState,useEffect } from 'react'
import typography from '../../config/typography';
import { ChatRoomType } from '../../types';
import { useRouter } from 'expo-router';
import getTimeAgo from '../../functionality/timeAgo';
import colors from '../../config/colors';
import { AntDesign } from "@expo/vector-icons";
import useFetchUserDataAsync from '@/hooks/async_storage/useFetchUserDataAsync';
import { deleteChatRoom } from '@/hooks/chat/chatApi';

 type AllChatByCategoryProps={
    chatRooms: ChatRoomType[];
 }

 const AllChatByCategory: React.FC<AllChatByCategoryProps> = ({chatRooms}) => {
const router=useRouter()
const [chatRoomsData,setChatRoomsData]=useState<ChatRoomType[]>(chatRooms);
const [showDelete,setShowDelete]=useState<boolean>(false);
const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
const [animation] = useState(new Animated.Value(0));
const currentUser=useFetchUserDataAsync();

const handleOnPress=(_id:string)=>{
    showDelete ? setShowDelete(false): router.push({pathname:`/chat/${_id}`})
}

const deleteChat=async(chat_id:string)=>{
    if(currentUser){
        const response=await deleteChatRoom(currentUser.token,chat_id);
        if(response){
            setChatRoomsData((prevChats)=>prevChats.filter((chat)=>chat._id !== chat_id))
        }
    }

}
 useEffect(() => {
    if (showDelete) {
      Animated.timing(animation, {
        toValue: 1, 
        duration: 300, 
        useNativeDriver: true, 
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showDelete]);

  if(chatRoomsData && chatRoomsData.length>0){
     return (
        <View >
            {chatRoomsData && chatRoomsData.map((chat,index)=>{
                return(
                    <ChatRooms 
                        handleOnPress={handleOnPress} 
                        chat={chat} 
                        key={index} 
                        showDelete={showDelete} 
                        setShowDelete={setShowDelete} 
                        animation={animation} 
                        deleteChat={deleteChat}
                        deleteChatId={deleteChatId} 
                        setDeleteChatId={setDeleteChatId}
                        currentUser={currentUser}
                        />
                )
            })}
        </View>
  )
  }

  return(
    <View style={{marginTop:"10%"}}>
      <Text style={styles.noChats}>Be the first one to start a discussion</Text>
    </View>
  )

   
}

const ChatRooms=(
    {handleOnPress,chat,showDelete,setShowDelete,animation,deleteChat,deleteChatId, setDeleteChatId,currentUser}:
    {handleOnPress:any,chat:any,showDelete:boolean,setShowDelete:any,animation:any,deleteChat:any,deleteChatId: string | null, setDeleteChatId: any,currentUser:any})=>{
    const {name,_id,lastMessage}=chat;
    const message=lastMessage && lastMessage?.content?.length >35 ? lastMessage.content.slice(0,35)+"..." : lastMessage.content;
     const handleLongPress = () => {
        if(currentUser._id === chat.created_by){
            setShowDelete(true); 
            setDeleteChatId(_id);
        }
    
  }
    return(
        <Pressable style={styles.chatContainer} onPress={()=>handleOnPress(_id)} onLongPress={()=>handleLongPress()} >
            <Image style={styles.chat_image} source={require("../../../assets/noosk_app_icon.png")}/>
            <View style={styles.textContainer}>
                <Text style={styles.chatName}>{name}</Text>
                {lastMessage && lastMessage.content ? 
                (<View>
                    <Text style={styles.lastMessage}>{ message }</Text>
                    <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
                        <Text style={[styles.lastMessage,{fontSize:13}]}>{getTimeAgo(lastMessage)}</Text>
                    </View>
                </View>)
                :
                (<View>
                    <Text style={styles.lastMessage}>No messages yet</Text>
                </View> )
            }
                
            </View>
                <Animated.View
        style={{
          opacity: animation, 
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0], 
              }),
            },
          ],
        }}
      > 
        {showDelete && deleteChatId === _id &&<DeleteChat deleteChat={deleteChat} id={_id}/>}
       </Animated.View>
            
        </Pressable>
    )
}

const DeleteChat=({deleteChat,id}:{deleteChat:any,id:string})=>{
    return(
        <TouchableOpacity style={styles.delete} onPress={()=>deleteChat(id)}>
            <AntDesign name="delete" size={22} color="#fff" />
            <Text style={{color:"#fff"}}>Delete</Text>
        </TouchableOpacity>
    )
}

export default AllChatByCategory

const styles = StyleSheet.create({
   
    chatContainer:{
       flexWrap:"wrap",
        flexDirection:"row",
        alignItems:"center",
        columnGap:10,       
    },
    textContainer:{
        borderBottomColor:"#acacac",
        borderBottomWidth:1,
        paddingVertical:10,
        flex:1,
        rowGap:3,
    },
    chat_image:{
        width:40,
        height:40,
        borderRadius:10,
    },
    chatName:{
        fontFamily:typography.appFont[400],
        fontSize:17,
    },
    lastMessage:{
        color:"#acacac",
        fontStyle:"italic"
    },
     buttonStyle: {
    width: 140,
    alignSelf: "flex-end",
    borderRadius: 4,
    // backgroundColor: colors.__teal_light,
    backgroundColor: "transparent",
  },
  creatorText: {
    color: colors.__teal_light,
    fontFamily: typography.appFont[700],
  },
   createDiscussion: {
    backgroundColor: "#0D0D0C",
    padding: 5,
    position: "absolute",
    bottom: "10%",
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderColor: colors.__teal_light,
    borderWidth: 1,
  },
  delete:{
    borderRadius:3,
    marginVertical:3,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"red",
    padding:9,
    rowGap:5},

    noChats:{
      textAlign:"center",
      fontFamily:typography.appFont[500],
      fontSize:16
    }
   
})