import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const Guidelines: React.FC = () => {
    return (
        <View style={styles.container}>
          <Text style={styles.header}>Noosk Community Guidelines</Text>
          <Text style={styles.subHeader}>The Short</Text>
          <Text style={styles.paragraph}>
            We want Noosk to be an authentic and safe place for talent to express itself and inspire others, and for personal growth. Help us foster this community. Post only your videos and always follow the law. Respect everyone on Noosk, don’t spam people or post nudity. Participate in the community or communities you have true interest in and be respectful and encouraging to others.
          </Text>
    
          <Text style={styles.subHeader}>The Long</Text>
          <Text style={styles.paragraph}>
            Noosk is a learning community of talented people that strive to grow their skills and share their talent. We understand that different points of view will have to coexist in order to create an open and exciting environment for our users to grow and learn. However, we are also committed to keep our community safe and stress-free for everyone.
          </Text>
    
          <Text style={styles.paragraph}>
            We created these Community Guidelines so users can help us foster and protect our community. By using Noosk, you agree to these guidelines and to our Terms of Use. We’re committed to these guidelines, and we hope you are too. Overstepping these boundaries may result in deleted content, disabled accounts, or other restrictions.
          </Text>
    
          <Text style={styles.paragraph}>Thank you for helping us,</Text>
          <Text style={styles.paragraph}>The Noosk Team</Text>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        // Define your styles here similar to CSS
        // Example:
        padding: 20,
        maxWidth: 800,
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
      },
      paragraph: {
        fontSize: 16,
        marginTop: 10,
      },
    });
    
    export default Guidelines;