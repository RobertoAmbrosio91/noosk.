import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import typography from '@/config/typography';
import useFetchUserDataAsync from '@/hooks/async_storage/useFetchUserDataAsync';
import fetchAllCategories from '@/hooks/categories/fetchAllCategories';
import colors from '@/config/colors';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import CustomButton from '../components/buttons&inputs/CustomButton';
import { createChatRoom } from '@/hooks/chat/chatApi';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ColorSpace } from 'react-native-reanimated';

type CreateChatRoomProps = {
    userCategories?:any;
};

type CategoryProp={
    _id:string;
    category:object;
    name:string
  }
const StartDiscussion:React.FC<CreateChatRoomProps> = () => {
    const router=useRouter();
    const params = useLocalSearchParams();
    console.log("Params:", params);
    const [categories,setCategories]=useState<CategoryProp[]>();
    const [chatName,setChatName]=useState<string>("");
    const [filteredCategories, setFilteredCategories] = useState<CategoryProp[] | null>(null); // Initialize as null
    const [selectedCategories,setSelectedCategories]=useState<CategoryProp[]|null>()
    const [selectedCategoryId,setSelectedCategoryId]=useState<string[]>();
    const currentUser=useFetchUserDataAsync();
    const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
    const searchCategories = (value:string) => {
        if (categories) {
            if (value.trim() === "") {
                setFilteredCategories(null); // Clear the filteredCategories when value is empty
            } else {
                const filtered = categories.filter((item) => item.name.includes(value));
                setFilteredCategories(filtered);
            }
        }
    };
    const handleSelectCategories=(category:CategoryProp)=>{
        const isSelected=selectedCategories?.includes(category);
        const maximumReached=selectedCategories && selectedCategories?.length >=4 ;
        if(isSelected){
            setSelectedCategories((prevSelected)=>prevSelected?.filter((prevCategory) => prevCategory !== category))
            setSelectedCategoryId((prevId)=>prevId?.filter((id)=>id !== category._id))
        }else if(!maximumReached){
        setSelectedCategories((prevCat)=>[...prevCat || [],category]);
        setSelectedCategoryId((prevId)=>[...prevId || [],category._id])
        }
    }

    const preSelectedCategory =params.catname as string;
    const preSelectedTitle =params.name as string;
    const token = currentUser?.token as string;
    const preSelectedCategoryId =params.category as string;

    const handleCreateChatRoom = async () => {  
        if (currentUser?.token) {
                const createChat = await createChatRoom(preSelectedTitle,preSelectedCategoryId,token,selectedCategoryId);
                const success=createChat.success;
                const _id=createChat.result._id;
                if (success){
                    router.replace(`/chat/${_id}`);
                } 
                else{console.log("error creating a chat")}
            }
        }
    
    
    

      
  useEffect(()=>{
    if(currentUser){
        try {
            const fetchCategories=async()=>{
                const fetchedCategories=await fetchAllCategories(currentUser.token);
                if(fetchedCategories.length>0){
                    setCategories(fetchedCategories);
                }
            }
            fetchCategories();
        
        } catch (error:any) {
            console.log("Something went wrong fetching categories",error)
        }
    }
  },[currentUser])



    return (
 
            <View style={styles.wrapper}>   
            
            <View style={styles.header}>
            <Text style={styles.title}>Start a Discussion</Text>
            <TouchableOpacity
            style={{ alignSelf: "flex-end",}}
            onPress={() => router.back()}
            >
            <AntDesign name="close" size={22} color="black" />
            </TouchableOpacity>
            </View>          


                <View style={styles.titleGroup}>
                    <Text >Category</Text>
                    <View style={styles.userCategorySelected}>
                        <Text >{preSelectedCategory}</Text>                                      
                    </View>
                </View>
                
        <View style={styles.titleGroup}>
            <Text>Title</Text>
            <View style={styles.userCategorySelected}>
            <Text >{preSelectedTitle}</Text>
            </View>
        </View>


         <View style={styles.titleGroup}>
            <Text>Add related fields</Text>
            <View style={{flexWrap:"wrap",flexDirection:"row",columnGap:5}}>
            {selectedCategories && selectedCategories.map((item,index)=>{
                return(
                    <SelectedCategory 
                    category={item} 
                    key={index} 
                    handleSelectCategories={handleSelectCategories}
                    />
                    )
                })}
            
         </View>
         <CustomInput name={"Search category (e.g., Finance)"} onChangeText={(value:string)=>searchCategories(value)}/>
         <View style={{flexWrap:"wrap",flexDirection:"row",columnGap:7}}>
            {filteredCategories && filteredCategories.map((category,index)=>{
                return(
                    <Category 
                    category={category} 
                    key={index} 
                    handleSelectCategories={handleSelectCategories}
                    />
                    )
                })}
            
            </View>
        </View>

         <View style={styles.buttonContainer}>
            <CustomButton 
            text={"Create Discussion"} 
            borderStyle={[styles.button]} 
            textStyle={styles.textButton} 
            onPress={()=>handleCreateChatRoom()}
            />
         </View>
        </View>


   
  )
}

const CustomInput=({name,onChangeText}:{name:string,onChangeText?:any,})=>{
    return(
        <View>
            <TextInput placeholder={name} style={styles.input} onChangeText={onChangeText}/>
        </View>
    )
}

const Category=({category,handleSelectCategories}:{category:CategoryProp,handleSelectCategories:any})=>{
    return(
            <TouchableOpacity style={styles.category}onPress={()=>handleSelectCategories(category)}>
                <Text>{category.name}</Text>
            </TouchableOpacity>
    )
}

const SelectedCategory=({category,handleSelectCategories}:{category:CategoryProp,handleSelectCategories:any})=>{
    return(
        <TouchableOpacity style={styles.selectedCategory} onPress={()=>handleSelectCategories(category)}>
            <Text>#{category.name}</Text>
            <Ionicons name="close" size={15} color="#000" />
        </TouchableOpacity>
    )
}

export default StartDiscussion

const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        flexDirection: "column",
        padding:15,
        rowGap:10,
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
        backgroundColor: "#EFEFEF",
        
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title:{
        fontFamily:typography.appFont[500],
        textAlign:"center",
        fontSize:18,
        alignSelf: "center",
    },
    input:{
        borderWidth:1,
        borderColor:"#acacac",
        padding:9,
        borderRadius:4
    },
    category:{
        borderColor:colors.__main_blue,
        borderWidth:1,
        padding:5,
        borderRadius:4,
        marginTop:5
    },
    selectedCategory:{
        borderColor:colors.__main_blue,
        borderWidth:1,
        padding:5,
        borderRadius:4,
        marginTop:5,
        flexDirection:"row",
        alignItems:"center"
    },
    button:{
        backgroundColor:colors.__teal_light,
        paddingHorizontal: Platform.OS === "web" ? 8 : 0,
    },
    textButton:{
        fontFamily:typography.appFont[600]
    },
    buttonContainer:{
        position:"absolute",
        bottom:40,
        alignSelf:"center",

    },
     userCategory:{
        padding:5,
        borderRadius:20,
        fontFamily:typography.appFont[400],
        borderWidth:1,
        borderColor:colors.__main_blue,
        marginTop:5
    },
    userCategorySelected:{
        padding:7,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "black",
        borderRadius:20,
        fontFamily:typography.appFont[400],
        marginTop:5,
        backgroundColor:colors.__teal_light,
        alignSelf: "flex-start",
        
    },
    titleGroup: {
        flexDirection: "column",
        marginVertical: 10,
        gap: 5,
    }
})