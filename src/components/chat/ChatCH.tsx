import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
  } from "react-native";
import React, { useEffect, useState,  } from "react";
import colors from "../../config/colors";
import useFetchUserDataAsync from "@/hooks/async_storage/useFetchUserDataAsync";
import { getChatRoomBySubcategory } from "@/hooks/chat/chatApi";
import getTimeAgo from "../../functionality/timeAgo";
import { useRouter } from "expo-router";
import { ChatItemType } from "../../types";
import typography from "@/config/typography";

 
  
  const ChatCH: React.FC<any> = ({userChats}) => {
    return (
    <View>
        {userChats && userChats.length>0 && userChats?.map((item:ChatItemType,index:number)=>{
            return(
                <RenderChatItem item={item} key={index}/>
            )
        })}
        {userChats && userChats.length===0  &&
          <Text style={styles.noDiscussions}>There are no open discussions in your areas of expertise</Text>
        }
    </View>
    
    );
  };
  
  const RenderChatItem = ({ item }: { item: ChatItemType }) => {
    const router=useRouter();
    let content=item.lastMessage?.content ? item.lastMessage?.content?.length>100 ? item.lastMessage.content.substring(0,80)+"..." : item.lastMessage.content :"No messages";
      return(
      <TouchableOpacity style={styles.chatItem} onPress={()=>router.push(`chat/${item._id}`)}>
        <Image source={require("../../../assets/noosk_app_icon.png")} style={styles.chatIcon} />
        <View style={styles.chatDetails}>
          <Text style={styles.chatTitle}>{item.name}</Text>
          <Text style={styles.chatLastMessage}>{content}</Text>
        </View>
        <Text style={styles.chatTimestamp}>{getTimeAgo(item.lastMessage)}</Text>
      </TouchableOpacity>
      )
      };
 
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        
      },
      
      chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal:5,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#acacac', 
        backgroundColor: 'transparent', 
      },
      chatItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      chatDetails: {
        flex: 1,
        justifyContent: 'center',
      },
      chatIcon: {
        width: 50, 
        height: 50, 
        marginRight: 10,
        borderRadius: 10,
      },
      chatSubcategory: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.__main_blue,
        marginBottom: 5,
      },
      chatTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.__main_blue,
        marginBottom: 5,
      },
      chatLastMessage: {
        fontSize: 14,
        color: colors.__main_blue, 
      },
      chatTimestamp: {
        fontSize: 12,
        color: '#C7C7C7',
        alignSelf: 'flex-start', 
      },
      noDiscussions:{
        textAlign:"center",
        marginTop:"10%",
        fontFamily:typography.appFont[500]
      }
  });
  
  export default ChatCH;