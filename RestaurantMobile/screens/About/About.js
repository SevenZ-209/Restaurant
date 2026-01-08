import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchAboutInfo } from '../../utils/Apis';
import aboutStyles from './AboutStyle';

const About = () => {
  const navigation = useNavigation();
  const [aboutData, setAboutData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAboutInfo();
      setAboutData(data);
    };
    loadData();
  }, []);

  if (!aboutData) {
    return (
      <View style={aboutStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={aboutStyles.wrapper}>
      <ScrollView style={aboutStyles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            aboutStyles.backButton,
            hoveredButton === 'back' && aboutStyles.backTextHover,
          ]}
          onPress={() => navigation.goBack()}
          onMouseEnter={() => setHoveredButton('back')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Text style={aboutStyles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={aboutStyles.header}>
          <Text style={aboutStyles.title}>Students' information</Text>
          <Text style={aboutStyles.subtitle}>
                      </Text>
        </View>

        <View style={aboutStyles.studentsSection}>
          <Text style={aboutStyles.sectionTitle}></Text>
          <View style={aboutStyles.studentsGrid}>
            {aboutData.students.map((student, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  aboutStyles.studentCard,
                  hoveredCard === index && aboutStyles.studentCardHover,
                ]}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <View style={aboutStyles.cardContent}>
                  <Text style={aboutStyles.studentName}>{student.name}</Text>
                  <Text style={aboutStyles.studentId}>{student.studentId}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
                <View style={aboutStyles.techSection}>
          <Text style={aboutStyles.sectionTitle}>Technology Stack</Text>

          <TouchableOpacity
            style={[
              aboutStyles.techCategory,
              hoveredButton === 'frontend' && aboutStyles.techSectionHover,
            ]}
            onMouseEnter={() => setHoveredButton('frontend')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Text style={aboutStyles.techCategoryTitle}>Frontend</Text>
            <Text style={aboutStyles.techList}>{aboutData.techStack.frontend.join(', ')}</Text>
          </TouchableOpacity>

          {/* Backend */}
          <TouchableOpacity
            style={[
              aboutStyles.techCategory,
              hoveredButton === 'backend' && aboutStyles.techSectionHover,
            ]}
            onMouseEnter={() => setHoveredButton('backend')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Text style={aboutStyles.techCategoryTitle}>Backend</Text>
            <Text style={aboutStyles.techList}>{aboutData.techStack.backend.join(', ')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              aboutStyles.techCategory,
              hoveredButton === 'tools' && aboutStyles.techSectionHover,
            ]}
            onMouseEnter={() => setHoveredButton('tools')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Text style={aboutStyles.techCategoryTitle}>Tools</Text>
            <Text style={aboutStyles.techList}>{aboutData.techStack.tools.join(', ')}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={aboutStyles.footer}>
          <Text style={aboutStyles.footerText}>
            BTN
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default About;
