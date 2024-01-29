import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Policy from '@/components/policy&terms/PrivacyPolicy';
import Terms from '@/components/policy&terms/TermsCondition';
import Guidelines from '@/components/policy&terms/Guidelines';


// Define the type for your state
type ActiveSection = 'Community Guidelines' | 'Privacy Policy' | 'Terms of Service' | null;

const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("Privacy Policy");

  const renderSectionText = (): JSX.Element | null => {
    switch(activeSection) {
      case 'Community Guidelines':
        return <Guidelines />;
      case 'Privacy Policy':
        return <Policy />;
      case 'Terms of Service':
        return <Terms />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={require('../../assets/noosk_app_icon.png') as ImageSourcePropType} 
        style={{height: 80, width: 80, borderRadius: 50}}/>
      </View>
      <View style={styles.main}>
        <TouchableOpacity 
          style={[styles.section, activeSection === 'Community Guidelines' && styles.sectionActive]}
          onPress={() => setActiveSection('Community Guidelines')}
          >
          <Text>Community Guidelines</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.section, activeSection === 'Privacy Policy' && styles.sectionActive]}
          onPress={() => setActiveSection('Privacy Policy')}
          >
          <Text>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.section, activeSection === 'Terms of Service' && styles.sectionActive]}
          onPress={() => setActiveSection('Terms of Service')}
          >
          <Text>Terms of Service</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.sectionActiveText}>
        {renderSectionText()}
        </View>
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 800,
      width: "100%",
      alignSelf: "center",
      padding: 10,
      backgroundColor: "#fff"
    },
    header: {
      width: 100,
      height: 100, // This is equivalent to setting an aspect ratio of 1.
      marginTop: 50,
      marginBottom: 50,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",  
    },
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 20,
      gap: 20
    },
    section: {
      cursor: 'pointer',
      padding: 15,
      backgroundColor: '#ffffff',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      maxWidth: 800,
    },
    sectionActive: {
      boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
      transform: [{ translateY: -2 }],
      backgroundColor: '#54D7B7',
      color: 'white',
      maxWidth: 800,
    },
    sectionActiveText: {
    padding: 20,
    }
  });

export default Privacy;
