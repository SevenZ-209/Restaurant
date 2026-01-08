import { StyleSheet, Platform } from 'react-native';

const aboutStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
  },
  backText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  backTextHover: {
    ...(Platform.OS === 'web' && {
      opacity: 0.7,
    }),
  },
  studentsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  studentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  studentCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
  },
  studentCardHover: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 5,
      transform: [{ translateY: -2 }],
    }),
  },
  cardContent: {
    gap: 5,
  },
  studentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  studentId: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  studentRole: {
    fontSize: 12,
    color: '#666',
  },
  techSection: {
    padding: 20,
  },
  techCategory: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
  },
  techCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  techList: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  techSectionHover: {
    ...(Platform.OS === 'web' && {
      backgroundColor: 'rgba(255, 107, 53, 0.05)',
      borderLeftWidth: 5,
      paddingLeft: 14,
    }),
  },
  linksSection: {
    padding: 20,
  },
  linksGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  linkButton: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
    }),
  },
  linkButtonHover: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#E55A2B',
      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.5)',
      transform: [{ translateY: -2 }],
    }),
  },
  linkText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default aboutStyles;
