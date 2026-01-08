import { StyleSheet } from 'react-native';

const homeStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  // ===== HERO SECTION =====
  heroSection: {
    width: '100%',
    height: 450,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 40,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  heroCTA: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
    elevation: 3,
  },
  heroCTAHovered: {
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ===== FEATURED DISHES SECTION =====
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 24,
  },
  dishesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dishCard: {
    width: '31%',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  dishImage: {
    width: '100%',
    height: 150,
  },
  dishInfo: {
    padding: 12,
  },
  dishName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  dishCategory: {
    fontSize: 12,
    color: '#888888',
  },

  // ===== ABOUT SECTION 1 =====
  aboutSection1: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
    gap: 30,
  },
  aboutContent1: {
    flex: 1,
  },
  aboutImage1: {
    flex: 1,
    height: 300,
    borderRadius: 8,
  },
  aboutTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 24,
    marginBottom: 20,
  },
  aboutButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  aboutButtonHovered: {
    backgroundColor: '#FF6B35',
  },
  aboutButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },

  // ===== ABOUT SECTION 2 (Reversed Layout) =====
  aboutSection2: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
    gap: 30,
  },
  aboutContent2: {
    flex: 1,
  },
  aboutImage2: {
    flex: 1,
    height: 300,
    borderRadius: 8,
  },
});

export default homeStyles;
