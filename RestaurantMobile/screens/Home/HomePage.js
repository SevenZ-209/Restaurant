import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchDishes } from '../../store/dishesSlice';
import homeStyles from './HomeStyle';

// Fallback images from assets
const FALLBACK_IMAGES = [
  require('../../assets/home/home-1.avif'),
  require('../../assets/home/home-2.avif'),
  require('../../assets/home/home-3.avif'),
  require('../../assets/home/hamburger.avif'),
  require('../../assets/home/pizzaavif.avif'),
  require('../../assets/home/spaghetti.avif'),
];

const getDishImage = (dish, index) => {
  // If dish has an image URL, use it
  if (dish.image) {
    return { uri: dish.image };
  }
  // Otherwise cycle through fallback images
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { dishes, loading } = useSelector((state) => state.dishes);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

  const handleAboutUs = () => {
    navigation.navigate('AboutTab');
  };

  if (loading) {
    return (
      <View style={homeStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={homeStyles.wrapper}>
      <ScrollView 
        style={homeStyles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* ===== SECTION 1: HERO BANNER ===== */}
        <View style={homeStyles.heroSection}>
          <Image
            source={require('../../assets/home/home-1.avif')}
            style={homeStyles.heroImage}
            resizeMode="cover"
          />
          <View style={homeStyles.heroOverlay} />
          <View style={homeStyles.heroContent}>
            <Text style={homeStyles.heroTitle}>Discover Amazing Dishes</Text>
            <Text style={homeStyles.heroSubtitle}>Taste the best culinary experience</Text>
            <TouchableOpacity
              style={[
                homeStyles.heroCTA,
                hoveredButton === 'explore' && homeStyles.heroCTAHovered,
              ]}
              onPress={() => navigation.navigate('Login')}
              onMouseEnter={() => setHoveredButton('explore')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Text style={homeStyles.heroButtonText}>Explore Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== SECTION 2: FEATURED DISHES GRID ===== */}
        <View style={homeStyles.sectionContainer}>
          <Text style={homeStyles.sectionTitle}>Featured Dishes</Text>
          <View style={homeStyles.dishesGrid}>
            {dishes.slice(0, 9).map((dish, index) => (
              <TouchableOpacity 
                key={index} 
                style={homeStyles.dishCard}
              >
                <Image
                  source={getDishImage(dish, index)}
                  style={homeStyles.dishImage}
                  resizeMode="cover"
                />
                <View style={homeStyles.dishInfo}>
                  <Text style={homeStyles.dishName}>{dish.name}</Text>
                  <Text style={homeStyles.dishCategory}>{dish.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===== SECTION 3: ABOUT US (Layout 1) ===== */}
        <View style={homeStyles.aboutSection1}>
          <View style={homeStyles.aboutContent1}>
            <Text style={homeStyles.aboutTitle}>About Our Restaurant</Text>
            <Text style={homeStyles.aboutText}>
              We are committed to serving the finest dishes with premium quality ingredients. 
              Our chefs bring years of experience and passion to every plate.
            </Text>
            <TouchableOpacity
              style={[
                homeStyles.aboutButton,
                hoveredButton === 'about1' && homeStyles.aboutButtonHovered,
              ]}
              onPress={handleAboutUs}
              onMouseEnter={() => setHoveredButton('about1')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Text style={homeStyles.aboutButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/home/home-2.avif')}
            style={homeStyles.aboutImage1}
            resizeMode="cover"
          />
        </View>

        {/* ===== SECTION 4: ABOUT US (Layout 2 - Reversed) ===== */}
        <View style={homeStyles.aboutSection2}>
          <Image
            source={require('../../assets/home/home-3.avif')}
            style={homeStyles.aboutImage2}
            resizeMode="cover"
          />
          <View style={homeStyles.aboutContent2}>
            <Text style={homeStyles.aboutTitle}>Our Vision</Text>
            <Text style={homeStyles.aboutText}>
              Creating memorable dining experiences through innovative cuisine and exceptional service. 
              Every dish tells a story of tradition and creativity.
            </Text>
            <TouchableOpacity
              style={[
                homeStyles.aboutButton,
                hoveredButton === 'about2' && homeStyles.aboutButtonHovered,
              ]}
              onPress={handleAboutUs}
              onMouseEnter={() => setHoveredButton('about2')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Text style={homeStyles.aboutButtonText}>Explore More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;
