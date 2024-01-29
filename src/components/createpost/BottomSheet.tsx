import React, { useRef, FC } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const BottomSheet: FC = () => {
  // toggle BottomSheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ['25%', '48%', '75%'];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView>
        <View>
          <Button title="Present Modal" onPress={handlePresentModal} />
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 50 }}
        >
          <View>
            <Text>hello</Text>
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default BottomSheet;
