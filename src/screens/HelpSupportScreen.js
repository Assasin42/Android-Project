import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Sıkça Sorulan Sorular Verisi
const faqData = [
  {
    id: 1,
    question: 'Otobüs saatleri ne kadar sıklıkla güncelleniyor?',
    answer: 'Uygulamamızdaki otobüs saatleri ve konum verileri, ulaşım ağından anlık olarak çekilmektedir. Trafik durumuna göre sapmalar canlı olarak haritada gösterilir.'
  },
  {
    id: 2,
    question: 'Hatalı veya eksik bir durak/hat gördüm, ne yapmalıyım?',
    answer: 'Hatalı olduğunu düşündüğünüz durak veya hat bilgilerini aşağıdaki iletişim kanallarını kullanarak bize iletebilirsiniz. En kısa sürede güncellenecektir.'
  },
  {
    id: 3,
    question: 'Favori duraklarımı nasıl düzenleyebilirim?',
    answer: 'Ana sayfada yer alan durak detay kartındaki yıldız simgesine tıklayarak durakları favorilerinize ekleyebilir veya profil sayfanızdan favorilerinizi yönetebilirsiniz.'
  },
  {
    id: 4,
    question: 'Uygulama konumumu bulamıyor, ne yapmalıyım?',
    answer: 'Cihazınızın ayarlar bölümünden Gümüş-Rota uygulamasına "Konum İzni" verdiğinizden ve GPS servisinizin açık olduğundan emin olun.'
  }
];

export default function HelpSupportScreen() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);

  // SSS Akordeon Açma/Kapatma
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yardım ve Destek</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* İletişim Bilgi Kartları (Tıklanamaz Düz View Yapıldı) */}
        <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
        <View style={styles.supportChannels}>
          
          <View style={styles.channelCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFE9ED' }]}>
              <Ionicons name="mail-outline" size={24} color="#FF2D55" />
            </View>
            <Text style={styles.channelLabel}>E-Posta</Text>
            <Text style={styles.channelSub}>destek@gumusrota.com</Text>
          </View>

          <View style={styles.channelCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F9EE' }]}>
              <Ionicons name="call-outline" size={24} color="#34C759" />
            </View>
            <Text style={styles.channelLabel}>Destek Hattı</Text>
            <Text style={styles.channelSub}>0555 123 45 67</Text>
          </View>

        </View>

        {/* SSS Bölümü */}
        <Text style={styles.sectionTitle}>Sıkça Sorulan Sorular</Text>
        
        {faqData.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity 
                style={styles.faqHeader} 
                activeOpacity={0.7} 
                onPress={() => toggleExpand(faq.id)}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#8E8E93" 
                />
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}

        <Text style={styles.footerText}>Gümüş-Rota v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    height: verticalScale(50),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  backButton: {
    padding: moderateScale(4),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: scale(24),
  },
  content: {
    padding: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: verticalScale(12),
    marginTop: verticalScale(15),
    textTransform: 'uppercase',
  },
  supportChannels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
  },
  channelCard: {
    backgroundColor: '#FFF',
    width: '47%',
    padding: scale(15),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconCircle: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  channelLabel: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#333',
  },
  channelSub: {
    fontSize: moderateScale(11),
    color: '#8E8E93',
    marginTop: verticalScale(4),
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(10),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(16),
  },
  faqQuestion: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: scale(10),
  },
  faqAnswerContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: scale(10),
  },
  faqAnswer: {
    fontSize: moderateScale(13),
    color: '#666',
    lineHeight: verticalScale(18),
  },
  footerText: {
    textAlign: 'center',
    color: '#C7C7CC',
    fontSize: moderateScale(12),
    marginTop: verticalScale(30),
    marginBottom: verticalScale(10),
  }
});